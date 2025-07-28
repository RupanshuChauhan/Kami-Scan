'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, User, Menu, X, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const liquidVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  }

  const magicButtonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Liquid Animation */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="text-purple-400"
                initial="hidden"
                animate="visible"
              >
                <motion.path
                  d="M20 5 L35 15 L35 25 L20 35 L5 25 L5 15 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  variants={liquidVariants}
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="3"
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
              </motion.svg>
              <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              KamiScan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">{session.user?.name}</span>
                  </div>
                  <motion.button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-purple-400 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-200 flex items-center space-x-2"
                    variants={magicButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="px-4 py-2 text-purple-400 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-200"
                  variants={magicButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium relative overflow-hidden"
                  variants={magicButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Get Started</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-purple-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-purple-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-300 hover:text-purple-400 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-purple-400 transition-colors">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {session ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-2 text-gray-300">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>{session.user?.name}</span>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="px-4 py-2 text-purple-400 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all flex items-center space-x-2 justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => signIn('google', { callbackUrl: '/' })}
                      className="px-4 py-2 text-purple-400 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => signIn('google', { callbackUrl: '/' })}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
