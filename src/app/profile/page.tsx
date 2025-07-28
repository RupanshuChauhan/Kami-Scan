'use client'

import { motion } from 'framer-motion'
import { User, LogOut, Shield, Bell, CreditCard, FileText, Activity } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'usage', label: 'Usage', icon: Activity },
  ]

  const handleLogout = () => {
    // Implement logout functionality
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 mb-8 border border-purple-500/20">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
                  <p className="text-purple-300 mb-2">john.doe@example.com</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                      Pro Plan
                    </span>
                    <span className="text-gray-400 text-sm">
                      <FileText className="inline w-4 h-4 mr-1" />
                      127 PDFs processed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-purple-400'
                        }`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </motion.button>
                    ))}
                    
                    <hr className="border-gray-700 my-4" />
                    
                    <motion.button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </motion.button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20"
                >
                  {activeTab === 'general' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            id="email"
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                            Company (Optional)
                          </label>
                          <input
                            id="company"
                            type="text"
                            placeholder="Enter your company name"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <motion.button
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'privacy' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Data Processing</h3>
                            <p className="text-gray-400 text-sm">Allow processing of uploaded documents</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked 
                              aria-label="Enable data processing"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Analytics</h3>
                            <p className="text-gray-400 text-sm">Help improve KamiScan with usage data</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked 
                              aria-label="Enable analytics"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Marketing Communications</h3>
                            <p className="text-gray-400 text-sm">Receive updates and promotional emails</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              aria-label="Enable marketing communications"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Processing Complete</h3>
                            <p className="text-gray-400 text-sm">Get notified when PDF processing is complete</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked 
                              aria-label="Enable processing complete notifications"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">Usage Limits</h3>
                            <p className="text-gray-400 text-sm">Alert when approaching monthly limits</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked 
                              aria-label="Enable usage limit alerts"
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20">
                          <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
                          <p className="text-gray-300 mb-4">Unlimited PDF processing with priority support</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-400">$19.99/month</span>
                            <motion.button
                              className="px-4 py-2 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Manage Subscription
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-700/30 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Payment Method</h4>
                          <p className="text-gray-400">•••• •••• •••• 4242</p>
                          <p className="text-gray-400 text-sm">Expires 12/2025</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'usage' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Usage Statistics</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
                          <h3 className="text-lg font-medium text-white mb-2">This Month</h3>
                          <p className="text-3xl font-bold text-purple-400">127</p>
                          <p className="text-gray-400 text-sm">PDFs processed</p>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-lg border border-blue-500/20">
                          <h3 className="text-lg font-medium text-white mb-2">All Time</h3>
                          <p className="text-3xl font-bold text-blue-400">1,247</p>
                          <p className="text-gray-400 text-sm">Total documents</p>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-green-900/20 to-yellow-900/20 rounded-lg border border-green-500/20">
                          <h3 className="text-lg font-medium text-white mb-2">Average Time</h3>
                          <p className="text-3xl font-bold text-green-400">0.8s</p>
                          <p className="text-gray-400 text-sm">Processing speed</p>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-yellow-900/20 to-red-900/20 rounded-lg border border-yellow-500/20">
                          <h3 className="text-lg font-medium text-white mb-2">Member Since</h3>
                          <p className="text-3xl font-bold text-yellow-400">Jan</p>
                          <p className="text-gray-400 text-sm">2024</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
