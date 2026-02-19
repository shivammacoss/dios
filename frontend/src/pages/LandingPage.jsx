import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import {
  Navbar,
  Hero,
  Features,
  Markets,
  Platforms,
  Accounts,
  Tools,
  Security,
  GetStarted,
  Company,
  Support,
  Footer,
  ScrollProgress
} from '../components/landing'

function LandingPage() {
  const { isDark } = useTheme()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className={`landing-page relative overflow-x-hidden bg-white dark:bg-gray-950 transition-colors duration-500`}>
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Why Choose Dios Derivatives */}
        <Features />
        
        {/* Markets We Offer */}
        <Markets />
        
        {/* Trading Platforms */}
        <Platforms />
        
        {/* Account Types */}
        <Accounts />
        
        {/* Tools & Features */}
        <Tools />
        
        {/* Security & Trust */}
        <Security />
        
        {/* Get Started Steps */}
        <GetStarted />
        
        {/* About Company */}
        <Company />
        
        {/* Support Section */}
        <Support />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-burgundy/5 dark:bg-burgundy/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-crimson/5 dark:bg-crimson/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  )
}

export default LandingPage
