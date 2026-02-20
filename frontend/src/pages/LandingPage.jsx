import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Sun, Moon, Download,
  DollarSign, BarChart2, Gem, Bitcoin, Building2, ArrowRight,
  Monitor, Smartphone, Laptop, Check, Star, Zap, Crown, Sparkles,
  BarChart3, Calendar, LineChart, Shield, History, Bot,
  Lock, Server, Eye, CheckCircle, UserPlus, FileCheck, Wallet, Rocket,
  Target, Heart, Award, MessageCircle, Mail, HelpCircle, FileText,
  Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Cpu, Globe
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// ==================== SCROLL PROGRESS ====================
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-burgundy to-crimson origin-left z-[60]" style={{ scaleX }} />
}

// ==================== NAV LINKS ====================
const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Markets', href: '#markets' },
  { name: 'Platforms', href: '#platforms' },
  { name: 'Accounts', href: '#accounts' },
  { name: 'Tools', href: '#tools' },
  { name: 'Company', href: '#company' },
  { name: 'Support', href: '#support' },
]

// ==================== NAVBAR ====================
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="fixed top-0 left-0 right-0 z-50 glass-effect transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a href="#home" className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img src="/DiosDerivativelogowhite.png" alt="Dios Derivatives" className="h-[60px] w-auto object-contain" />
          </motion.a>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <motion.a key={link.name} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-burgundy dark:hover:text-crimson-light font-medium transition-colors relative group text-sm" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -2 }}>
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-burgundy to-crimson transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.button onClick={toggleDarkMode} className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.3 }}><Sun className="w-5 h-5 text-yellow-400" /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.3 }}><Moon className="w-5 h-5 text-gray-700" /></motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.a href="/Dios.apk" download className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 transition-all hover:bg-green-500/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Download className="w-4 h-4" />Download APK</motion.a>
            <motion.button onClick={() => navigate('/user/login')} className="px-4 py-2 text-burgundy dark:text-crimson-light font-semibold hover:bg-burgundy/10 rounded-full transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Log In</motion.button>
            <motion.button onClick={() => navigate('/user/signup')} className="btn-primary text-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Open Account</motion.button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <motion.button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800" whileTap={{ scale: 0.9 }}>
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </motion.button>
            <motion.button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} whileTap={{ scale: 0.9 }}>
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden glass-effect border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a key={link.name} href={link.href} className="block text-gray-700 dark:text-gray-300 hover:text-burgundy font-medium py-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</motion.a>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <motion.button onClick={() => { navigate('/user/login'); setIsMobileMenuOpen(false); }} className="w-full py-3 text-burgundy font-semibold border border-burgundy rounded-full">Log In</motion.button>
                <motion.button onClick={() => { navigate('/user/signup'); setIsMobileMenuOpen(false); }} className="w-full btn-primary">Open Account</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ==================== HERO ====================
const trades = [
  { pair: 'EUR/USD', price: '1.0845', change: '+0.12%', up: true },
  { pair: 'GBP/USD', price: '1.2678', change: '-0.05%', up: false },
  { pair: 'USD/JPY', price: '148.32', change: '+0.23%', up: true },
  { pair: 'XAU/USD', price: '2,045.60', change: '+0.45%', up: true },
  { pair: 'BTC/USD', price: '43,245.00', change: '+1.25%', up: true },
  { pair: 'ETH/USD', price: '2,584.50', change: '+0.85%', up: true },
]

function TradeItem({ trade }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 min-w-max">
      <span className="font-semibold text-white text-sm">{trade.pair}</span>
      <span className="text-white/90 text-sm font-mono">{trade.price}</span>
      <span className={`flex items-center gap-1 text-xs font-medium ${trade.up ? 'text-green-400' : 'text-red-400'}`}>
        <span className={`w-0 h-0 border-l-[4px] border-r-[4px] ${trade.up ? 'border-b-[6px] border-b-current border-l-transparent border-r-transparent' : 'border-t-[6px] border-t-current border-l-transparent border-r-transparent'}`} />
        {trade.change}
      </span>
    </div>
  )
}

function Hero() {
  const allTrades = [...trades, ...trades]
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/dvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(108,14,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(108,14,42,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-gradient-to-t from-black/60 to-transparent pt-20 pb-6">
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-scroll-left">
              {allTrades.map((trade, index) => <TradeItem key={index} trade={trade} />)}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll-left { animation: scroll-left 30s linear infinite; }
        .animate-scroll-left:hover { animation-play-state: paused; }
      `}</style>
    </section>
  )
}

// ==================== FEATURES ====================
const features = [
  { icon: Cpu, title: 'Institutional-grade liquidity', description: 'Access deep liquidity pools for seamless trade execution at competitive prices.' },
  { icon: BarChart3, title: 'Real-time pricing', description: 'Get accurate, up-to-the-second market data to make informed trading decisions.' },
  { icon: Zap, title: 'No dealing desk execution', description: 'Direct market access with no intermediaries ensures transparent pricing.' },
  { icon: Globe, title: 'Multi-asset trading', description: 'Trade forex, indices, commodities, crypto, and shares all in one platform.' },
]

function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-10 w-64 h-64 bg-burgundy/5 dark:bg-burgundy/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-crimson/5 dark:bg-crimson/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div ref={ref} initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Why Choose Dios Derivatives</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">A Platform Built for<span className="gradient-text block">Modern Traders</span></motion.h2>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">Dios Derivatives combines advanced technology, deep liquidity, and professional tools to deliver a trading experience trusted by beginners and professionals alike.</motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-6">
              {[{ value: '0.0', suffix: 's', label: 'Execution Speed' }, { value: '500+', suffix: '', label: 'Trading Instruments' }, { value: '99.9', suffix: '%', label: 'Uptime' }].map((stat, index) => (
                <motion.div key={index} className="text-center" whileHover={{ scale: 1.05 }}>
                  <motion.div className="text-3xl font-bold gradient-text" initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 + index * 0.1, type: "spring" }}>{stat.value}{stat.suffix}</motion.div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }} whileHover={{ y: -10, scale: 1.02 }} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy to-crimson flex items-center justify-center mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><feature.icon className="w-7 h-7 text-white" /></motion.div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-burgundy dark:group-hover:text-crimson-light transition-colors">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== MARKETS ====================
const markets = [
  { icon: DollarSign, title: 'Forex', description: 'Major, minor & exotic pairs', pairs: '80+ Pairs', color: 'from-burgundy to-crimson' },
  { icon: BarChart2, title: 'Indices', description: 'Trade global stock indices', pairs: '15+ Indices', color: 'from-crimson to-burgundy' },
  { icon: Gem, title: 'Commodities', description: 'Gold, silver, oil & more', pairs: '20+ Assets', color: 'from-burgundy to-crimson' },
  { icon: Bitcoin, title: 'Crypto', description: 'Digital asset CFDs', pairs: '50+ Cryptos', color: 'from-crimson to-burgundy' },
  { icon: Building2, title: 'Shares', description: 'Top global companies', pairs: '300+ Stocks', color: 'from-burgundy to-crimson' },
]

function Markets() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="markets" className="py-24 relative overflow-hidden dark:bg-gray-950 transition-colors duration-500">
      <div className="absolute inset-0"><motion.div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-burgundy/5 dark:from-burgundy/10 to-transparent" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Markets</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Trade Multiple Markets<span className="gradient-text block">in One Place</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Diversify your portfolio with access to a wide range of global financial instruments.</motion.p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {markets.map((market, index) => (
            <motion.div key={market.title} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }} whileHover={{ y: -10, scale: 1.02 }} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
              <motion.div className={`absolute inset-0 bg-gradient-to-br ${market.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`} />
              <motion.div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${market.color} flex items-center justify-center mb-6`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}><market.icon className="w-8 h-8 text-white" /></motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-burgundy dark:group-hover:text-crimson-light transition-colors">{market.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{market.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{market.pairs}</div>
              <motion.div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity" initial={{ x: -10 }} whileHover={{ x: 0 }}><ArrowRight className="w-6 h-6 text-burgundy dark:text-crimson-light" /></motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== PLATFORMS ====================
const platforms = [
  { icon: Monitor, title: 'Web Trader', description: 'No download required', features: ['One-click trading', 'Advanced indicators', 'Multi-chart layout', 'Risk management tools'] },
  { icon: Smartphone, title: 'Mobile App', description: 'Trade on the go', features: ['Push notifications', 'Biometric login', 'Quick deposits', 'Portfolio tracking'] },
  { icon: Laptop, title: 'Desktop Terminal', description: 'Advanced trading features', features: ['Algorithmic trading', 'Custom scripts', 'Depth of market', 'Advanced order types'] },
]

function Platforms() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="platforms" className="py-24 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-1/4 left-0 w-72 h-72 bg-burgundy/5 dark:bg-burgundy/10 rounded-full blur-3xl" animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 right-0 w-96 h-96 bg-crimson/5 dark:bg-crimson/10 rounded-full blur-3xl" animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Platforms</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Powerful Platforms.<span className="gradient-text block">Seamless Experience.</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Trade anytime, anywhere using our advanced platforms built for speed and reliability.</motion.p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div key={platform.title} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }} whileHover={{ y: -8 }} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
              <motion.div className="absolute inset-0 bg-gradient-to-br from-burgundy/5 to-crimson/5 dark:from-burgundy/10 dark:to-crimson/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-burgundy to-crimson flex items-center justify-center mb-6 relative z-10" whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}><platform.icon className="w-8 h-8 text-white" /></motion.div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-burgundy dark:group-hover:text-crimson-light transition-colors">{platform.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{platform.description}</p>
                <ul className="space-y-3 mb-6">
                  {platform.features.map((feature, i) => (
                    <motion.li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400" initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 + index * 0.1 + i * 0.05 }}>
                      <div className="w-5 h-5 bg-gradient-to-br from-burgundy to-crimson rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>{feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.button className="flex items-center gap-2 text-burgundy dark:text-crimson-light font-semibold group/btn" whileHover={{ x: 5 }}>Learn More<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== ACCOUNTS ====================
const accounts = [
  { icon: Star, name: 'Standard Account', description: 'Best for beginners', price: '0', features: ['$0 min. deposit', 'Competitive spreads', 'Instant execution', 'No commission', 'Web & mobile trading'], popular: false },
  { icon: Zap, name: 'ECN & Raw Account', description: 'For raw spreads', price: '200', features: ['$200 min. deposit', 'Raw spreads from 0.0 pips', 'Ultra-fast execution', 'Low commission', 'Ideal for scalping'], popular: true },
  { icon: Crown, name: 'Pro Account', description: 'For experienced traders', price: '500', features: ['$500 min. deposit', 'Tight spreads', 'Priority execution', 'Advanced analytics', 'API trading support'], popular: false },
  { icon: Sparkles, name: 'VIP Account', description: 'For high-volume traders', price: '10K', features: ['$10,000 min. deposit', 'Institutional pricing', 'Dedicated manager', 'Custom liquidity', 'VIP event access'], popular: false },
]

function Accounts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const navigate = useNavigate()

  return (
    <section id="accounts" className="py-24 relative overflow-hidden dark:bg-gray-950 transition-colors duration-500">
      <div className="absolute inset-0">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-burgundy/5 dark:bg-burgundy/10 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.span className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Account Types</motion.span>
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Accounts Designed for<span className="gradient-text block">Every Trader</span></motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {accounts.map((account, index) => (
            <motion.div key={account.name} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.15 }} whileHover={{ y: -10 }} className={`relative rounded-2xl p-8 transition-all duration-300 ${account.popular ? 'bg-gradient-to-br from-burgundy to-crimson text-white shadow-2xl scale-105' : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700'}`}>
              {account.popular && <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2"><div className="bg-white text-burgundy px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg"><Zap className="w-4 h-4" />Most Popular</div></motion.div>}
              <motion.div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${account.popular ? 'bg-white/20' : 'bg-gradient-to-br from-burgundy to-crimson'}`} whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><account.icon className="w-7 h-7 text-white" /></motion.div>
              <h3 className={`text-2xl font-bold mb-2 ${account.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{account.name}</h3>
              <p className={`text-sm mb-4 ${account.popular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>{account.description}</p>
              <div className="mb-6"><span className={`text-4xl font-bold ${account.popular ? 'text-white' : 'gradient-text'}`}>${account.price}</span><span className={account.popular ? 'text-white/80' : 'text-gray-500'}> min. deposit</span></div>
              <ul className="space-y-3 mb-8">
                {account.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${account.popular ? 'bg-white/20' : 'bg-red-100 dark:bg-burgundy/20'}`}><Check className={`w-3 h-3 ${account.popular ? 'text-white' : 'text-burgundy dark:text-crimson-light'}`} /></div><span className={account.popular ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}>{feature}</span></li>
                ))}
              </ul>
              <motion.button onClick={() => navigate('/user/signup')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 ${account.popular ? 'bg-white text-burgundy hover:bg-gray-100' : 'bg-gradient-to-r from-burgundy to-crimson text-white'}`}>Open Account<ArrowRight className="w-4 h-4" /></motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== TOOLS ====================
const tools = [
  { icon: BarChart3, title: 'Advanced Charting', description: 'Professional-grade charts with 50+ technical indicators.' },
  { icon: Calendar, title: 'Economic Calendar', description: 'Stay ahead of market-moving events with real-time data.' },
  { icon: LineChart, title: 'Market Analysis', description: 'Daily insights and technical analysis from experts.' },
  { icon: Shield, title: 'Risk Management', description: 'Advanced tools including stop-loss and margin alerts.' },
  { icon: History, title: 'Trade History', description: 'Detailed analytics to track your performance.' },
  { icon: Bot, title: 'Automated Trading', description: 'Build and deploy trading algorithms with our API.' },
]

function Tools() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="tools" className="py-24 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-1/3 left-0 w-72 h-72 bg-burgundy/5 dark:bg-burgundy/10 rounded-full blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.span className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Tools & Features</motion.span>
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Everything You Need to<span className="gradient-text block">Trade Smarter</span></motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div key={tool.title} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
              <motion.div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy to-crimson flex items-center justify-center mb-4" whileHover={{ scale: 1.1 }}><tool.icon className="w-6 h-6 text-white" /></motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-burgundy dark:group-hover:text-crimson-light transition-colors">{tool.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== SECURITY ====================
const trustPoints = [
  { icon: Lock, text: 'Secure payment gateways' },
  { icon: Shield, text: 'Encrypted data protection' },
  { icon: Server, text: 'Compliance-ready infrastructure' },
  { icon: Eye, text: '24/7 system monitoring' },
]

function Security() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-burgundy-dark to-gray-900">
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burgundy/30 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-crimson/20 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div ref={ref} initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <motion.span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-4">Security & Trust</motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Security You Can<span className="block text-crimson-light">Rely On</span></motion.h2>
            <motion.p className="text-lg text-white/80 mb-8 leading-relaxed">Your funds and data are protected with industry-leading security protocols. Dios Derivatives uses encrypted transactions, segregated accounts, and advanced monitoring systems.</motion.p>
            <motion.div className="grid sm:grid-cols-2 gap-4">
              {trustPoints.map((point, index) => (
                <motion.div key={index} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6 + index * 0.1 }} whileHover={{ x: 5 }}>
                  <motion.div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center" whileHover={{ scale: 1.1 }}><point.icon className="w-5 h-5 text-crimson-light" /></motion.div>
                  <span className="text-white/90 font-medium">{point.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="relative flex items-center justify-center">
            <motion.div className="absolute w-64 h-64 border-2 border-white/10 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute w-80 h-80 border-2 border-white/5 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
            <motion.div className="relative w-40 h-40 bg-gradient-to-br from-burgundy to-crimson rounded-3xl flex items-center justify-center shadow-2xl" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}><Shield className="w-20 h-20 text-white" /></motion.div>
            {[0, 1, 2, 3].map((i) => (<motion.div key={i} className="absolute" style={{ top: `${20 + i * 15}%`, left: i % 2 === 0 ? '10%' : '80%' }} animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}><CheckCircle className="w-6 h-6 text-green-400" /></motion.div>))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== GET STARTED ====================
const steps = [
  { icon: UserPlus, number: '01', title: 'Register your account', description: 'Sign up in minutes with our simple process' },
  { icon: FileCheck, number: '02', title: 'Verify your identity', description: 'Quick and secure KYC verification' },
  { icon: Wallet, number: '03', title: 'Deposit funds', description: 'Multiple payment methods available' },
  { icon: Rocket, number: '04', title: 'Start trading instantly', description: 'Access global markets immediately' },
]

function GetStarted() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const navigate = useNavigate()

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <motion.span className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">Get Started</motion.span>
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Start Trading in<span className="gradient-text block">Minutes</span></motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div key={step.number} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.15 }} className="relative">
              <motion.div whileHover={{ y: -10 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 h-full">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-burgundy to-crimson rounded-full flex items-center justify-center text-white font-bold text-sm">{step.number}</div>
                <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy/10 to-crimson/10 flex items-center justify-center mb-4 mt-2" whileHover={{ scale: 1.1, rotate: 10 }}><step.icon className="w-7 h-7 text-burgundy dark:text-crimson-light" /></motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && <motion.div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-burgundy to-crimson" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.5 + index * 0.2 }} />}
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }} className="text-center">
          <motion.button onClick={() => navigate('/user/signup')} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Open Account Now<ArrowRight className="w-5 h-5" /></motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// ==================== COMPANY ====================
const values = [
  { icon: Target, title: 'Innovation', description: 'Cutting-edge technology' },
  { icon: Eye, title: 'Transparency', description: 'Clear pricing always' },
  { icon: Heart, title: 'Integrity', description: 'Ethical practices' },
  { icon: Award, title: 'Excellence', description: 'Highest standards' },
]

const stats = [
  { value: '50K+', label: 'Active Traders' },
  { value: '150+', label: 'Countries Served' },
  { value: '10+', label: 'Years Experience' },
  { value: '24/7', label: 'Support Available' },
]

function Company() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="company" className="py-24 relative overflow-hidden dark:bg-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div ref={ref} initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <motion.span className="inline-block px-4 py-2 bg-burgundy/10 text-burgundy dark:text-crimson-light rounded-full text-sm font-semibold mb-4">About Dios Derivatives</motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Next-Generation<span className="gradient-text block">Trading Platform</span></motion.h2>
            <motion.p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">Dios Derivatives is a next-generation trading platform focused on providing traders with cutting-edge technology, transparent pricing, and reliable execution.</motion.p>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + index * 0.1 }} whileHover={{ scale: 1.05 }} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent dark:border-gray-700">
                  <div className="w-10 h-10 bg-gradient-to-br from-burgundy to-crimson rounded-lg flex items-center justify-center flex-shrink-0"><value.icon className="w-5 h-5 text-white" /></div>
                  <div><h4 className="font-semibold text-gray-900 dark:text-white">{value.title}</h4><p className="text-xs text-gray-500 dark:text-gray-400">{value.description}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
            <motion.div className="absolute inset-0 bg-gradient-to-br from-burgundy/5 to-crimson/5 dark:from-burgundy/10 dark:to-crimson/10 rounded-3xl" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity }} />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4 + index * 0.1, type: "spring" }} whileHover={{ scale: 1.1 }} className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-700 dark:to-gray-750 rounded-2xl">
                    <motion.div className="text-3xl md:text-4xl font-bold gradient-text mb-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}>{stat.value}</motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================== SUPPORT ====================
const supportOptions = [
  { icon: MessageCircle, title: 'Live Chat', description: 'Instant support from our team', action: 'Start Chat' },
  { icon: Mail, title: 'Email Support', description: 'Response within 24 hours', action: 'Send Email' },
  { icon: HelpCircle, title: 'Help Center', description: 'Browse our knowledge base', action: 'Visit Center' },
  { icon: FileText, title: 'FAQs', description: 'Find quick answers', action: 'View FAQs' },
]

function Support() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="support" className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-burgundy-dark to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burgundy/20 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <motion.span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-4">Support</motion.span>
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Need Help? We're Here<span className="block text-crimson-light">24/7</span></motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option, index) => (
            <motion.div key={option.title} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + index * 0.1 }} whileHover={{ y: -10, scale: 1.02 }} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
              <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy to-crimson flex items-center justify-center mb-4" whileHover={{ scale: 1.1, rotate: 10 }}><option.icon className="w-7 h-7 text-white" /></motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
              <p className="text-white/70 text-sm mb-4">{option.description}</p>
              <motion.div className="flex items-center gap-2 text-crimson-light font-semibold text-sm" whileHover={{ x: 5 }}>{option.action}<ArrowRight className="w-4 h-4" /></motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== FOOTER ====================
const footerLinks = {
  company: { title: 'Company', links: ['About Us', 'Careers', 'Legal Documents', 'Privacy Policy'] },
  trading: { title: 'Trading', links: ['Markets', 'Platforms', 'Accounts', 'Fees'] },
  resources: { title: 'Resources', links: ['Blog', 'Tutorials', 'Glossary', 'Economic Calendar'] },
}

const socialLinks = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Instagram, href: '#' },
]

function Footer() {
  const { isDarkMode } = useTheme()
  
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }} transition={{ duration: 15, repeat: Infinity }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <motion.a href="#home" className="flex items-center mb-6" whileHover={{ scale: 1.05 }}>
              <img src="/DiosDerivativelogowhite.png" alt="Dios Derivatives" className="h-[60px] w-auto object-contain" />
            </motion.a>
            <p className="text-gray-400 mb-6 max-w-sm">Empowering traders worldwide with cutting-edge technology, transparent pricing, and reliable execution.</p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a key={index} href={social.href} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-burgundy transition-colors" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}><social.icon className="w-5 h-5" /></motion.a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: linkIndex * 0.05 }}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">{link}<ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" /></a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">© 2026 Dios Derivatives. All Rights Reserved.</p>
            <p className="text-gray-500 text-xs text-center md:text-right max-w-md">Trading leveraged products involves risk and may not be suitable for all investors.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  useEffect(() => { document.documentElement.style.scrollBehavior = 'smooth'; return () => { document.documentElement.style.scrollBehavior = 'auto'; }; }, [])

  return (
    <div className="relative overflow-x-hidden bg-white dark:bg-gray-950 transition-colors duration-500">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Markets />
        <Platforms />
        <Accounts />
        <Tools />
        <Security />
        <GetStarted />
        <Company />
        <Support />
      </main>
      <Footer />
    </div>
  )
}
