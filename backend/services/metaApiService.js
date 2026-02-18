// MetaApi Price Service - Real-time tick-by-tick market data via MetaApi Cloud SDK
// Supports: Forex, Crypto, Metals, Energy, Stocks (all symbols from MT5 broker)
// Docs: https://github.com/metaapi/metaapi-javascript-sdk

import MetaApi, { SynchronizationListener } from 'metaapi.cloud-sdk/esm-node'
import dotenv from 'dotenv'

dotenv.config()

const META_API_TOKEN = process.env.META_API_TOKEN || ''
const META_API_ACCOUNT_ID = process.env.META_API_ACCOUNT_ID || ''

// Price cache - stores latest bid/ask for each symbol
const priceCache = new Map()

// Callbacks
let onPriceUpdate = null
let onConnectionChange = null

// Connection state
let isConnected = false
let connection = null
let account = null
let api = null

// Symbol lists (populated from MT5 terminal after sync)
let dynamicSymbols = {
  forex: [],
  crypto: [],
  stocks: [],
  metals: [],
  energy: []
}

// Symbol name mappings
const symbolNames = {}

// All symbols and symbol map
let ALL_SYMBOLS = []
let SYMBOL_MAP = {}

// Fallback symbol lists (used before MT5 sync completes)
const FOREX_SYMBOLS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD',
  'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'AUDCAD',
  'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY', 'AUDNZD', 'CADCHF', 'GBPCHF',
  'GBPNZD', 'EURNZD', 'NZDCAD', 'NZDCHF', 'AUDCHF', 'GBPAUD', 'GBPCAD',
  'USDSGD', 'USDHKD', 'USDZAR', 'USDTRY', 'USDMXN', 'USDPLN', 'USDSEK',
  'USDNOK', 'USDDKK', 'USDCNH', 'EURPLN', 'EURSEK', 'EURNOK', 'EURDKK',
  'GBPSEK', 'GBPNOK', 'CHFSEK', 'SEKJPY', 'NOKJPY', 'SGDJPY', 'ZARJPY'
]

const CRYPTO_SYMBOLS = [
  'BTCUSD', 'ETHUSD', 'BNBUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD', 'DOGEUSD',
  'TRXUSD', 'LINKUSD', 'MATICUSD', 'DOTUSD', 'SHIBUSD', 'LTCUSD', 'BCHUSD',
  'AVAXUSD', 'XLMUSD', 'UNIUSD', 'ATOMUSD', 'ETCUSD', 'FILUSD', 'ICPUSD',
  'VETUSD', 'NEARUSD', 'GRTUSD', 'AAVEUSD', 'MKRUSD', 'ALGOUSD', 'FTMUSD',
  'SANDUSD', 'MANAUSD', 'AXSUSD', 'THETAUSD', 'FLOWUSD', 'SNXUSD', 'EOSUSD',
  'CHZUSD', 'ENJUSD', 'PEPEUSD', 'ARBUSD', 'OPUSD', 'SUIUSD', 'APTUSD',
  'INJUSD', 'TONUSD', 'HBARUSD', 'NEOUSD', 'FETUSDT', 'RNDRUSDT', 'WLDUSDT'
]

const STOCK_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA',
  'JPM', 'V', 'JNJ', 'WMT', 'PG', 'MA', 'UNH', 'HD',
  'DIS', 'BAC', 'ADBE', 'CRM', 'NFLX', 'CSCO',
  'PFE', 'TMO', 'ABT', 'COST', 'PEP', 'AVGO', 'NKE',
  'MRK', 'ABBV', 'KO', 'LLY', 'CVX', 'MCD', 'WFC',
  'DHR', 'ACN', 'NEE', 'TXN', 'PM', 'BMY', 'UPS',
  'QCOM', 'RTX', 'HON', 'INTC', 'AMD', 'PYPL', 'SBUX'
]

const METAL_SYMBOLS = [
  'XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD', 'XAUEUR', 'XAUAUD', 'XAUGBP',
  'XAUCHF', 'XAUJPY', 'XAGEUR', 'XAGAUD', 'XAGGBP'
]

const ENERGY_SYMBOLS = [
  'USOIL', 'UKOIL', 'NGAS', 'BRENT', 'WTI', 'GASOLINE', 'HEATING'
]

// Custom SynchronizationListener to receive tick-by-tick price updates
class PriceListener extends SynchronizationListener {
  async onSymbolPriceUpdated(instanceIndex, price) {
    try {
      const symbol = price.symbol
      if (!symbol) return

      const bid = price.bid || 0
      const ask = price.ask || 0

      if (bid > 0 && ask > 0) {
        const priceData = {
          bid,
          ask,
          mid: (bid + ask) / 2,
          time: price.time ? new Date(price.time).getTime() : Date.now()
        }

        priceCache.set(symbol, priceData)

        if (onPriceUpdate) {
          onPriceUpdate(symbol, priceData)
        }
      }
    } catch (e) {
      // Silently handle parse errors to not flood logs
    }
  }

  async onConnected(instanceIndex, replicas) {
    console.log('[MetaApi] Streaming connection established')
    isConnected = true
    if (onConnectionChange) onConnectionChange(true)
  }

  async onDisconnected(instanceIndex) {
    console.log('[MetaApi] Streaming connection lost')
    isConnected = false
    if (onConnectionChange) onConnectionChange(false)
  }

  async onBrokerConnectionStatusChanged(instanceIndex, connected) {
    console.log(`[MetaApi] Broker connection: ${connected ? 'connected' : 'disconnected'}`)
  }

  async onSymbolSpecificationsUpdated(instanceIndex, specifications, removedSymbols) {
    // Update symbol lists when specifications are received
    if (specifications && specifications.length > 0) {
      processSpecifications(specifications)
    }
  }

  async onSymbolSpecificationUpdated(instanceIndex, specification) {
    if (specification) {
      processSpecifications([specification])
    }
  }
}

// Process MT5 symbol specifications to categorize symbols
function processSpecifications(specifications) {
  for (const spec of specifications) {
    const symbol = spec.symbol
    if (!symbol) continue

    // Store symbol name
    if (spec.description) {
      symbolNames[symbol] = spec.description
    }

    // Categorize based on MT5 symbol properties
    const path = (spec.path || '').toLowerCase()
    const category = (spec.category || '').toLowerCase()

    if (path.includes('forex') || category.includes('forex') ||
        (symbol.length === 6 && /^[A-Z]{6}$/.test(symbol) && !symbol.startsWith('XA') && !symbol.startsWith('XP'))) {
      if (!dynamicSymbols.forex.includes(symbol)) {
        dynamicSymbols.forex.push(symbol)
      }
    } else if (path.includes('crypto') || category.includes('crypto') ||
               symbol.endsWith('USD') && ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE'].some(c => symbol.startsWith(c))) {
      if (!dynamicSymbols.crypto.includes(symbol)) {
        dynamicSymbols.crypto.push(symbol)
      }
    } else if (path.includes('metal') || category.includes('metal') ||
               symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('XPT') || symbol.startsWith('XPD')) {
      if (!dynamicSymbols.metals.includes(symbol)) {
        dynamicSymbols.metals.push(symbol)
      }
    } else if (path.includes('energy') || path.includes('oil') || category.includes('energy') ||
               ['USOIL', 'UKOIL', 'NGAS', 'BRENT', 'WTI'].includes(symbol)) {
      if (!dynamicSymbols.energy.includes(symbol)) {
        dynamicSymbols.energy.push(symbol)
      }
    } else if (path.includes('stock') || category.includes('stock') || spec.exchange) {
      if (!dynamicSymbols.stocks.includes(symbol)) {
        dynamicSymbols.stocks.push(symbol)
      }
    }

    // Add to ALL_SYMBOLS and SYMBOL_MAP
    if (!ALL_SYMBOLS.includes(symbol)) {
      ALL_SYMBOLS.push(symbol)
    }
    SYMBOL_MAP[symbol] = symbol
  }
}

// Subscribe to market data for all symbols we want to track
async function subscribeToSymbols(conn, symbols) {
  let subscribed = 0
  let failed = 0

  for (const symbol of symbols) {
    try {
      await conn.subscribeToMarketData(symbol, [
        { type: 'quotes' }
      ])
      subscribed++
    } catch (e) {
      failed++
      // Symbol might not exist on this broker - that's OK
    }
  }

  return { subscribed, failed }
}

// Connect to MetaApi and start streaming prices
async function connect() {
  if (!META_API_TOKEN) {
    console.log('[MetaApi] ERROR: Missing API token - set META_API_TOKEN in .env')
    console.log('[MetaApi] Get your token from https://app.metaapi.cloud/api-access/generate-token')
    return
  }

  if (!META_API_ACCOUNT_ID) {
    console.log('[MetaApi] ERROR: Missing account ID - set META_API_ACCOUNT_ID in .env')
    console.log('[MetaApi] Get your account ID from https://app.metaapi.cloud/accounts')
    return
  }

  console.log('[MetaApi] Initializing connection...')

  try {
    // Create MetaApi instance
    api = new MetaApi(META_API_TOKEN)

    // Get the trading account
    account = await api.metatraderAccountApi.getAccount(META_API_ACCOUNT_ID)

    // Wait for account to be deployed (if not already)
    const initialState = account.state
    if (initialState !== 'DEPLOYED') {
      console.log(`[MetaApi] Account state: ${initialState}, waiting for deployment...`)
      await account.deploy()
    }

    await account.waitDeployed()
    console.log('[MetaApi] Account deployed')

    // Get streaming connection
    connection = account.getStreamingConnection()

    // Add price listener BEFORE connecting
    const priceListener = new PriceListener()
    connection.addSynchronizationListener(priceListener)

    // Connect
    await connection.connect()
    console.log('[MetaApi] Connecting to streaming API...')

    // Wait for synchronization
    await connection.waitSynchronized()
    console.log('[MetaApi] Synchronized with terminal')

    isConnected = true
    if (onConnectionChange) onConnectionChange(true)

    // Get terminal state for specifications
    const terminalState = connection.terminalState
    const specifications = terminalState.specifications
    
    if (specifications && specifications.length > 0) {
      console.log(`[MetaApi] Received ${specifications.length} symbol specifications`)
      processSpecifications(specifications)
    }

    // Build list of symbols to subscribe to
    const symbolsToSubscribe = new Set()

    // Add from specifications (all broker symbols)
    if (specifications) {
      specifications.forEach(spec => {
        if (spec.symbol) symbolsToSubscribe.add(spec.symbol)
      })
    }

    // Also add our fallback lists in case they match broker symbols
    ;[...FOREX_SYMBOLS, ...CRYPTO_SYMBOLS, ...STOCK_SYMBOLS, ...METAL_SYMBOLS, ...ENERGY_SYMBOLS].forEach(s => {
      symbolsToSubscribe.add(s)
    })

    console.log(`[MetaApi] Subscribing to ${symbolsToSubscribe.size} symbols...`)

    // Subscribe in batches to avoid rate limiting
    const allSymbols = Array.from(symbolsToSubscribe)
    const batchSize = 50
    let totalSubscribed = 0
    let totalFailed = 0

    for (let i = 0; i < allSymbols.length; i += batchSize) {
      const batch = allSymbols.slice(i, i + batchSize)
      const result = await subscribeToSymbols(connection, batch)
      totalSubscribed += result.subscribed
      totalFailed += result.failed

      // Small delay between batches to respect rate limits
      if (i + batchSize < allSymbols.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log(`[MetaApi] Subscribed: ${totalSubscribed} symbols, Failed: ${totalFailed} symbols`)

    // Read initial prices from terminal state
    for (const symbol of allSymbols) {
      try {
        const price = terminalState.price(symbol)
        if (price && price.bid && price.ask) {
          const priceData = {
            bid: price.bid,
            ask: price.ask,
            mid: (price.bid + price.ask) / 2,
            time: price.time ? new Date(price.time).getTime() : Date.now()
          }
          priceCache.set(symbol, priceData)
        }
      } catch (e) {
        // Symbol might not have price yet
      }
    }

    console.log(`[MetaApi] Initial price cache: ${priceCache.size} symbols`)

    // Log status after 10 seconds
    setTimeout(() => {
      const forexCount = dynamicSymbols.forex.filter(s => priceCache.has(s)).length
      const cryptoCount = dynamicSymbols.crypto.filter(s => priceCache.has(s)).length
      const metalCount = dynamicSymbols.metals.filter(s => priceCache.has(s)).length
      const energyCount = dynamicSymbols.energy.filter(s => priceCache.has(s)).length
      const stockCount = dynamicSymbols.stocks.filter(s => priceCache.has(s)).length

      console.log(`[MetaApi] Price cache: ${priceCache.size} total symbols`)
      console.log(`[MetaApi] Forex: ${forexCount}/${dynamicSymbols.forex.length}, Crypto: ${cryptoCount}/${dynamicSymbols.crypto.length}`)
      console.log(`[MetaApi] Metals: ${metalCount}/${dynamicSymbols.metals.length}, Energy: ${energyCount}/${dynamicSymbols.energy.length}`)
      console.log(`[MetaApi] Stocks: ${stockCount}/${dynamicSymbols.stocks.length}`)
    }, 10000)

  } catch (error) {
    console.error('[MetaApi] Connection error:', error.message)
    isConnected = false

    // Retry after 30 seconds
    console.log('[MetaApi] Retrying in 30 seconds...')
    setTimeout(connect, 30000)
  }
}

function disconnect() {
  if (connection) {
    connection.close()
    connection = null
  }
  if (account) {
    account = null
  }
  if (api) {
    api = null
  }
  isConnected = false
  console.log('[MetaApi] Disconnected')
}

function getPrice(symbol) {
  return priceCache.get(symbol) || null
}

function getAllPrices() {
  return Object.fromEntries(priceCache)
}

function getPriceCache() {
  return priceCache
}

async function fetchPriceREST(symbol) {
  // Try to get from terminal state if available
  if (connection && connection.terminalState) {
    try {
      const price = connection.terminalState.price(symbol)
      if (price && price.bid && price.ask) {
        const priceData = {
          bid: price.bid,
          ask: price.ask,
          mid: (price.bid + price.ask) / 2,
          time: price.time ? new Date(price.time).getTime() : Date.now()
        }
        priceCache.set(symbol, priceData)
        return priceData
      }
    } catch (e) {
      // Fall through
    }
  }
  return priceCache.get(symbol) || null
}

async function fetchBatchPricesREST(symbols) {
  const prices = {}
  for (const symbol of symbols) {
    const price = await fetchPriceREST(symbol)
    if (price) prices[symbol] = price
  }
  return prices
}

function setOnPriceUpdate(callback) {
  onPriceUpdate = callback
}

function setOnConnectionChange(callback) {
  onConnectionChange = callback
}

function isWebSocketConnected() {
  return isConnected
}

function getConnectionStatus() {
  return {
    isConnected,
    connections: [{
      type: 'metaapi',
      connected: isConnected
    }],
    priceCount: priceCache.size
  }
}

// Categorize symbol for frontend
function categorizeSymbol(symbol) {
  // Check dynamic symbols first (populated from MT5 specifications)
  if (dynamicSymbols.forex.includes(symbol)) return 'Forex'
  if (dynamicSymbols.metals.includes(symbol)) return 'Metals'
  if (dynamicSymbols.energy.includes(symbol)) return 'Energy'
  if (dynamicSymbols.stocks.includes(symbol)) return 'Stocks'
  if (dynamicSymbols.crypto.includes(symbol)) return 'Crypto'

  // Fallback to static lists
  if (FOREX_SYMBOLS.includes(symbol)) return 'Forex'
  if (METAL_SYMBOLS.includes(symbol)) return 'Metals'
  if (ENERGY_SYMBOLS.includes(symbol)) return 'Energy'
  if (STOCK_SYMBOLS.includes(symbol)) return 'Stocks'
  if (CRYPTO_SYMBOLS.includes(symbol)) return 'Crypto'

  // Heuristic fallback
  if (symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('XPT') || symbol.startsWith('XPD')) return 'Metals'
  if (['USOIL', 'UKOIL', 'NGAS', 'BRENT', 'WTI'].includes(symbol)) return 'Energy'
  if (symbol.length === 6 && /^[A-Z]{6}$/.test(symbol)) return 'Forex'

  return 'Other'
}

// Get symbol name
function getSymbolName(symbol) {
  return symbolNames[symbol] || symbol
}

// Get dynamic symbols for frontend
function getDynamicSymbols() {
  return dynamicSymbols
}

export default {
  connect,
  disconnect,
  getPrice,
  getAllPrices,
  getPriceCache,
  fetchPriceREST,
  fetchBatchPricesREST,
  setOnPriceUpdate,
  setOnConnectionChange,
  isWebSocketConnected,
  getConnectionStatus,
  categorizeSymbol,
  getSymbolName,
  getDynamicSymbols,
  get SYMBOL_MAP() { return SYMBOL_MAP },
  get ALL_SYMBOLS() { return ALL_SYMBOLS },
  FOREX_SYMBOLS,
  CRYPTO_SYMBOLS,
  STOCK_SYMBOLS,
  METAL_SYMBOLS,
  ENERGY_SYMBOLS
}
