'use client'

import { motion } from 'framer-motion'
import { Cookie, Settings, Shield, BarChart, Target, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    preferences: true
  })

  const toggleCookie = (type: keyof typeof cookieSettings) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: <Shield className="w-6 h-6" />,
      description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: [
        'Authentication tokens',
        'Security preferences',
        'Session management',
        'Load balancing'
      ],
      required: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: <BarChart className="w-6 h-6" />,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: [
        'Google Analytics',
        'Page view statistics',
        'User behavior analysis',
        'Performance monitoring'
      ],
      required: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: <Target className="w-6 h-6" />,
      description: 'These cookies are used to track visitors across websites to display relevant advertisements and marketing campaigns.',
      examples: [
        'Ad targeting',
        'Campaign tracking',
        'Social media integration',
        'Retargeting pixels'
      ],
      required: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      icon: <Settings className="w-6 h-6" />,
      description: 'These cookies remember your preferences and settings to provide a personalized experience on future visits.',
      examples: [
        'Language preferences',
        'Theme settings',
        'Display preferences',
        'User interface customization'
      ],
      required: false,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const cookieList = [
    {
      name: '_kamiscan_session',
      purpose: 'Session management and authentication',
      type: 'Essential',
      duration: 'Session',
      domain: 'kamiscan.com'
    },
    {
      name: '_kamiscan_auth',
      purpose: 'User authentication state',
      type: 'Essential',
      duration: '30 days',
      domain: 'kamiscan.com'
    },
    {
      name: '_ga',
      purpose: 'Google Analytics tracking',
      type: 'Analytics',
      duration: '2 years',
      domain: 'google-analytics.com'
    },
    {
      name: '_gid',
      purpose: 'Google Analytics session tracking',
      type: 'Analytics',
      duration: '24 hours',
      domain: 'google-analytics.com'
    },
    {
      name: '_kamiscan_prefs',
      purpose: 'User interface preferences',
      type: 'Preferences',
      duration: '1 year',
      domain: 'kamiscan.com'
    },
    {
      name: '_fbp',
      purpose: 'Facebook pixel tracking',
      type: 'Marketing',
      duration: '90 days',
      domain: 'facebook.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Learn about how KamiScan uses cookies and similar technologies to improve your experience 
              and provide our services.
            </p>
            <div className="inline-flex items-center bg-orange-500/20 text-orange-400 px-6 py-3 rounded-full text-sm font-medium">
              <Cookie className="w-4 h-4 mr-2" />
              Last updated: January 27, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-orange-500/20 rounded-lg p-3">
                  <Cookie className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">What Are Cookies?</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                  They help websites remember information about your visit, which can make your next visit easier and the site more useful to you.
                </p>
                <p>
                  KamiScan uses cookies and similar technologies to provide, secure, and improve our services. 
                  This policy explains what cookies we use, why we use them, and how you can control them.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cookie Settings */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Cookie Preferences</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Customize your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the site to function.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-r ${cookie.color} p-3 rounded-lg`}>
                      {cookie.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{cookie.title}</h3>
                      {cookie.required && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => toggleCookie(cookie.id as keyof typeof cookieSettings)}
                    disabled={cookie.required}
                    className={`p-2 transition-colors ${
                      cookie.required ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                    whileHover={!cookie.required ? { scale: 1.1 } : {}}
                    whileTap={!cookie.required ? { scale: 0.9 } : {}}
                  >
                    {cookieSettings[cookie.id as keyof typeof cookieSettings] ? (
                      <ToggleRight className="w-8 h-8 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </motion.button>
                </div>

                <p className="text-gray-300 mb-4">{cookie.description}</p>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {cookie.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="text-sm text-gray-400 flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Cookie Preferences
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Cookie List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Cookies We Use</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Here&apos;s a detailed list of the specific cookies we use on KamiScan.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-white font-medium">Cookie Name</th>
                      <th className="text-left py-4 px-6 text-white font-medium">Purpose</th>
                      <th className="text-left py-4 px-6 text-white font-medium">Type</th>
                      <th className="text-left py-4 px-6 text-white font-medium">Duration</th>
                      <th className="text-left py-4 px-6 text-white font-medium">Domain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieList.map((cookie, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="py-4 px-6 text-purple-400 font-mono text-sm">{cookie.name}</td>
                        <td className="py-4 px-6 text-gray-300">{cookie.purpose}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cookie.type === 'Essential' ? 'bg-green-500/20 text-green-400' :
                            cookie.type === 'Analytics' ? 'bg-blue-500/20 text-blue-400' :
                            cookie.type === 'Marketing' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {cookie.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{cookie.duration}</td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{cookie.domain}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <Settings className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Managing Your Cookies</h2>
              <p className="text-gray-300">
                You have several options for managing cookies on your device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Browser Settings</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>Most browsers allow you to control cookies through their settings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>You can set your browser to refuse cookies or alert you when cookies are being sent</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>Disabling essential cookies may affect site functionality</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Third-Party Tools</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>Use privacy-focused browser extensions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>Opt-out of analytics tracking through provider websites</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <span>Configure ad preferences with advertising networks</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Questions About Cookies?</h2>
            <p className="text-gray-300 mb-8">
              If you have any questions about our use of cookies or this Cookie Policy, 
              please contact our privacy team.
            </p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Privacy Team
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
