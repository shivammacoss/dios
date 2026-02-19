import WebSocket from 'ws'
import dotenv from 'dotenv'
dotenv.config()

// Infoway API Configuration
const INFOWAY_API_KEY = process.env.INFOWAY_API_KEY || ''

// WebSocket endpoints (built dynamically to ensure API key is loaded)
function getWsEndpoints() {
  const apiKey = process.env.INFOWAY_API_KEY || INFOWAY_API_KEY
  return {
    forex: `wss://data.infoway.io/ws?business=common&apikey=${apiKey}`,
    crypto: `wss://data.infoway.io/ws?business=crypto&apikey=${apiKey}`,
    stock: `wss://data.infoway.io/ws?business=stock&apikey=${apiKey}`
  }
}

// Symbol lists by category (from Infoway API - Optimized for active symbols)
// FOREX: 20 most popular pairs
const FOREX_SYMBOLS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD', 'EURGBP', 'EURJPY', 'GBPJPY',
  'EURCHF', 'EURAUD', 'EURCAD', 'GBPAUD', 'GBPCAD', 'AUDCAD', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY'
]
// METALS: 4 main symbols
const METAL_SYMBOLS = ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD']
// ENERGY: Disabled (no reliable data)
const ENERGY_SYMBOLS = []
// CRYPTO: 30 most popular (high liquidity)
const CRYPTO_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT', 'LTCUSDT',
  'LINKUSDT', 'SHIBUSDT', 'UNIUSDT', 'ATOMUSDT', 'TRXUSDT', 'BCHUSDT', 'XLMUSDT', 'ETCUSDT', 'NEARUSDT',
  'AAVEUSDT', 'FTMUSDT', 'SANDUSDT', 'MANAUSDT', 'ARBUSDT', 'OPUSDT', 'SUIUSDT', 'APTUSDT', 'INJUSDT',
  'FILUSDT', 'ICPUSDT', 'MKRUSDT'
]
// STOCKS: Disabled (requires 3rd WS connection)
const STOCK_SYMBOLS = []

// Price cache
const priceCache = new Map()

// Connection state
let forexWs = null
let cryptoWs = null
let stockWs = null
let isConnected = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10
const RECONNECT_DELAY = 5000

// Callbacks
let onPriceUpdate = null
let onConnectionChange = null

// Generate unique trace ID
function generateTraceId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Subscribe to symbols
function subscribeToSymbols(ws, symbols, type) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  
  const request = {
    code: 10000,
    trace: generateTraceId(),
    data: {
      codes: symbols.join(',')
    }
  }
  
  console.log(`[Infoway] Subscribing to ${symbols.length} ${type} symbols`)
  ws.send(JSON.stringify(request))
}

// Create WebSocket connection
function createConnection(type, endpoint, symbols) {
  const apiKey = process.env.INFOWAY_API_KEY || INFOWAY_API_KEY
  if (!apiKey) {
    console.log('[Infoway] No API key configured, skipping connection')
    return null
  }

  console.log(`[Infoway] Connecting to ${type} stream...`)
  const ws = new WebSocket(endpoint)
  
  ws.on('open', () => {
    console.log(`[Infoway] ${type} WebSocket connected successfully`)
    reconnectAttempts = 0
    
    // Subscribe to symbols after connection
    setTimeout(() => {
      subscribeToSymbols(ws, symbols, type)
    }, 1000)
    
    // Start heartbeat
    startHeartbeat(ws, type)
  })
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      
      // Handle price push (code 10002)
      if (message.code === 10002 && message.data) {
        const priceData = message.data
        const symbol = priceData.s
        const price = parseFloat(priceData.p)
        const timestamp = priceData.t
        
        // Skip if no valid price
        if (!price || isNaN(price)) return
        
        // Update cache
        const spread = getSpreadForSymbol(symbol)
        const bid = price
        const ask = price + spread
        
        priceCache.set(symbol, {
          bid,
          ask,
          price,
          timestamp,
          volume: priceData.v,
          direction: priceData.td
        })
        
        // Notify callback
        if (onPriceUpdate) {
          onPriceUpdate(symbol, { bid, ask, price, timestamp })
        }
      }
      
      // Handle subscription response (code 10001)
      if (message.code === 10001) {
        console.log(`[Infoway] ${type} subscription confirmed:`, message.msg)
        // Log cache size after subscription
        setTimeout(() => {
          console.log(`[Infoway] ${type} cache size: ${priceCache.size} symbols`)
        }, 5000)
      }
      
      // Handle errors
      if (message.code && message.code < 0) {
        console.error(`[Infoway] ${type} error:`, message)
      }
      
      // Log any other messages for debugging
      if (message.code && message.code !== 10001 && message.code !== 10002) {
        console.log(`[Infoway] ${type} message code ${message.code}:`, JSON.stringify(message).substring(0, 200))
      }
    } catch (error) {
      // Ignore parse errors for binary data
    }
  })
  
  ws.on('error', (error) => {
    console.error(`[Infoway] ${type} WebSocket error:`, error.message)
  })
  
  ws.on('close', (code, reason) => {
    console.log(`[Infoway] ${type} WebSocket closed (code: ${code})`)
    
    // Attempt reconnect
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++
      console.log(`[Infoway] Reconnecting ${type} in ${RECONNECT_DELAY}ms (attempt ${reconnectAttempts})`)
      setTimeout(() => {
        const endpoints = getWsEndpoints()
        if (type === 'forex') forexWs = createConnection('forex', endpoints.forex, [...FOREX_SYMBOLS, ...METAL_SYMBOLS, ...ENERGY_SYMBOLS])
        if (type === 'crypto') cryptoWs = createConnection('crypto', endpoints.crypto, CRYPTO_SYMBOLS)
        if (type === 'stock') stockWs = createConnection('stock', endpoints.stock, STOCK_SYMBOLS)
      }, RECONNECT_DELAY)
    }
  })
  
  return ws
}

// Heartbeat to keep connection alive
function startHeartbeat(ws, type) {
  const heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ code: 10010, trace: generateTraceId() }))
    } else {
      clearInterval(heartbeatInterval)
    }
  }, 30000) // Every 30 seconds
}

// Get spread for symbol (simulated spread based on asset type)
function getSpreadForSymbol(symbol) {
  if (symbol.includes('USD') && symbol.length === 6) {
    // Forex majors
    if (['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF'].includes(symbol)) return 0.00010
    return 0.00020 // Forex crosses
  }
  if (symbol.includes('XAU')) return 0.30 // Gold
  if (symbol.includes('XAG')) return 0.020 // Silver
  if (symbol.includes('OIL') || symbol.includes('NGAS')) return 0.03 // Energy
  if (symbol.includes('USDT')) return parseFloat(priceCache.get(symbol)?.price || 100) * 0.0001 // Crypto 0.01%
  return 0.01 // Default
}

// Connect to all WebSocket streams
function connect() {
  const apiKey = process.env.INFOWAY_API_KEY || INFOWAY_API_KEY
  if (!apiKey) {
    console.log('[Infoway] No API key configured. Set INFOWAY_API_KEY in .env')
    return
  }
  
  console.log('[Infoway] Connecting to price streams with API key:', apiKey.substring(0, 10) + '...')
  const endpoints = getWsEndpoints()
  
  console.log('[Infoway] Forex endpoint:', endpoints.forex.substring(0, 60) + '...')
  console.log('[Infoway] Crypto endpoint:', endpoints.crypto.substring(0, 60) + '...')
  
  // Connect to forex/commodities stream (106 symbols: 86 forex + 17 metals + 3 energy)
  forexWs = createConnection('forex', endpoints.forex, [...FOREX_SYMBOLS, ...METAL_SYMBOLS, ...ENERGY_SYMBOLS])
  
  // Connect to crypto stream (105 symbols)
  setTimeout(() => {
    cryptoWs = createConnection('crypto', endpoints.crypto, CRYPTO_SYMBOLS)
  }, 2000) // Delay crypto connection to avoid rate limiting
  
  // Connect to stock stream (44 symbols) - Using 3rd WS connection would need plan upgrade
  // Plan allows 2 WS connections, so stocks are disabled
  // To enable: upgrade plan to 3+ WS connections
  // setTimeout(() => {
  //   stockWs = createConnection('stock', endpoints.stock, STOCK_SYMBOLS)
  // }, 4000)
  
  isConnected = true
  if (onConnectionChange) onConnectionChange(true)
}

// Disconnect all streams
function disconnect() {
  if (forexWs) forexWs.close()
  if (cryptoWs) cryptoWs.close()
  if (stockWs) stockWs.close()
  isConnected = false
  if (onConnectionChange) onConnectionChange(false)
}

// Get price from cache
function getPrice(symbol) {
  return priceCache.get(symbol) || null
}

// Get all prices
function getAllPrices() {
  return Object.fromEntries(priceCache)
}

// Get price cache reference
function getPriceCache() {
  return priceCache
}

// Categorize symbol
function categorizeSymbol(symbol) {
  if (FOREX_SYMBOLS.includes(symbol)) return 'Forex'
  if (METAL_SYMBOLS.includes(symbol)) return 'Metals'
  if (ENERGY_SYMBOLS.includes(symbol)) return 'Energy'
  if (CRYPTO_SYMBOLS.includes(symbol)) return 'Crypto'
  if (STOCK_SYMBOLS.includes(symbol)) return 'Stocks'
  // Check by pattern
  if (symbol.includes('XAU') || symbol.includes('XAG') || symbol.includes('XPT') || symbol.includes('XPD')) return 'Metals'
  if (symbol.includes('OIL') || symbol.includes('NGAS') || symbol.includes('BRENT')) return 'Energy'
  if (symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH')) return 'Crypto'
  if (symbol.length <= 5 && !symbol.includes('USD')) return 'Stocks'
  return 'Forex'
}

// Get connection status
function getConnectionStatus() {
  return {
    connected: isConnected,
    forexConnected: forexWs?.readyState === WebSocket.OPEN,
    cryptoConnected: cryptoWs?.readyState === WebSocket.OPEN,
    stockConnected: stockWs?.readyState === WebSocket.OPEN,
    cachedSymbols: priceCache.size,
    reconnectAttempts
  }
}

// Set callbacks
function setOnPriceUpdate(callback) {
  onPriceUpdate = callback
}

function setOnConnectionChange(callback) {
  onConnectionChange = callback
}

export default {
  connect,
  disconnect,
  getPrice,
  getAllPrices,
  getPriceCache,
  categorizeSymbol,
  getConnectionStatus,
  setOnPriceUpdate,
  setOnConnectionChange,
  FOREX_SYMBOLS,
  METAL_SYMBOLS,
  ENERGY_SYMBOLS,
  CRYPTO_SYMBOLS,
  STOCK_SYMBOLS
}
