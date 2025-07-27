'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, FileText, Zap, Shield, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const linkVariants = {
    hover: { 
      y: -2,
      color: "#a855f7",
      transition: { duration: 0.2 }
    }
  }

  const iconVariants = {
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  }

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-purple-400 rounded-lg opacity-20 animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                KamiScan
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transform your PDFs into intelligent summaries with our AI-powered technology. 
              Experience zero-latency processing and professional-grade results.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400"
                variants={iconVariants}
                whileHover="hover"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400"
                variants={iconVariants}
                whileHover="hover"
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400"
                variants={iconVariants}
                whileHover="hover"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-purple-400"
                variants={iconVariants}
                whileHover="hover"
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/features" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Features</span>
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/pricing" className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Pricing</span>
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/api" className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>API</span>
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/about">About Us</Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/contact">Contact</Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/careers">Careers</Link>
                </motion.div>
              </li>
              <li>
                <motion.div variants={linkVariants} whileHover="hover">
                  <Link href="/blog">Blog</Link>
                </motion.div>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-3">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Zero Latency</h4>
              <p className="text-gray-400 text-sm">Instant AI processing for immediate results</p>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Secure & Private</h4>
              <p className="text-gray-400 text-sm">Your documents are processed securely</p>
            </motion.div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-3">
                <Heart className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-medium mb-2">User Friendly</h4>
              <p className="text-gray-400 text-sm">Intuitive interface with magic effects</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} KamiScan. All rights reserved. Built with ❤️ for intelligent document processing.
            </p>
            <div className="flex space-x-6 text-sm">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link href="/privacy" className="text-gray-400">Privacy Policy</Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link href="/terms" className="text-gray-400">Terms of Service</Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link href="/cookies" className="text-gray-400">Cookie Policy</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
