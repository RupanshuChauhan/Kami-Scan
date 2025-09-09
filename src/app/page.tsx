'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  Brain, Zap, Globe, BarChart3, MessageSquare,
  FileText, Download, Star, ArrowRight, CheckCircle,
  Sparkles, Target, Clock, Shield, Rocket
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdvancedPdfProcessor from '../components/AdvancedPdfProcessor'
import PdfChat from '../components/PdfChat'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import ExportManager from '../components/ExportManager'
import ProcessingErrorBoundary from '../components/ProcessingErrorBoundary'
import toast from 'react-hot-toast'

interface ProcessingResult {
  id: string
  summary: string
  keyPoints: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  readingTime: number
  wordCount: number
  topics: string[]
  confidence: number
  citations: Array<{ page: number; text: string; relevance: number }>
  metadata: {
    fileName?: string
    processingTime: number
    wordCount: number
    pageCount: number
  }
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'process' | 'chat' | 'analytics'>('process')
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [showFeatures, setShowFeatures] = useState(false)
  const [userStats, setUserStats] = useState({
    totalProcessed: 0,
    timesSaved: 0,
    accuracyRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (session?.user) {
      fetchUserStats()
    } else {
      setIsLoading(false)
    }
  }, [session, status])

  const fetchUserStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
      // Set default stats on error
      setUserStats({
        totalProcessed: 0,
        timesSaved: 0,
        accuracyRate: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessComplete = (result: ProcessingResult) => {
    setProcessingResult(result)
    setActiveTab('process')
    fetchUserStats() // Refresh stats
    toast.success('🎉 Document processed successfully!')
  }

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Processing',
      description: 'Multiple processing modes including summarization, Q&A, translation, and deep analysis',
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Real-time conversation with your documents using advanced AI streaming',
      color: 'from-green-600 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your document processing and usage patterns',
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: Download,
      title: 'Multi-Format Export',
      description: 'Export in PDF, Word, PowerPoint, Markdown, and more with custom templates',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Process and translate documents in 50+ languages with context preservation',
      color: 'from-pink-600 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encrypted processing and secure data handling',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  const tabs = [
    { 
      id: 'process', 
      label: 'Process Documents', 
      icon: FileText, 
      description: 'Upload and analyze PDFs with AI' 
    },
    { 
      id: 'chat', 
      label: 'Chat with PDF', 
      icon: MessageSquare, 
      description: 'Interactive conversation',
      disabled: !processingResult 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Usage insights and trends' 
    }
  ]

  // Show loading state while session is being determined
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Loading KamiScan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-purple-300 mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Transform Your
              <br />
              Document Workflow
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Experience the future of document processing with AI-powered summarization, 
              interactive chat, advanced analytics, and enterprise-grade security.
            </p>

            {session?.user && (
              <motion.div
                className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.totalProcessed}</div>
                  <div className="text-sm text-gray-400">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.timesSaved}h</div>
                  <div className="text-sm text-gray-400">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.accuracyRate}%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={() => setShowFeatures(!showFeatures)}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Features</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Application Interface */}
      {session?.user && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Tab Navigation */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as 'process' | 'chat' | 'analytics')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : tab.disabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  whileHover={!tab.disabled ? { scale: 1.02 } : {}}
                  whileTap={!tab.disabled ? { scale: 0.98 } : {}}
                  disabled={tab.disabled}
                >
                  <tab.icon size={20} />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                  {tab.disabled && (
                    <div className="text-xs bg-gray-600 px-2 py-1 rounded">
                      Process a document first
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProcessingErrorBoundary>
                    <AdvancedPdfProcessor onProcessComplete={handleProcessComplete} />
                  </ProcessingErrorBoundary>
                  
                  {processingResult && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg border">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold">Processing Results</h3>
                          <ExportManager 
                            result={processingResult}
                            onExport={(format) => {
                              toast.success(`Exported as ${format.toUpperCase()}`)
                            }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-6">
                            <div>
                              <h4 className="font-semibold mb-3">Summary</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 leading-relaxed">{processingResult.summary}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Key Points</h4>
                              <ul className="space-y-2">
                                {(processingResult.keyPoints || []).map((point, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Target size={16} className="text-blue-600" />
                                <span className="font-medium text-blue-900">Confidence</span>
                              </div>
                              <div className="text-2xl font-bold text-blue-600">{processingResult.confidence || 0}%</div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-green-600" />
                                <span className="font-medium text-green-900">Reading Time</span>
                              </div>
                              <div className="text-2xl font-bold text-green-600">{processingResult.readingTime || 0}m</div>
                            </div>
                            
                            <div className="bg-purple-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText size={16} className="text-purple-600" />
                                <span className="font-medium text-purple-900">Word Count</span>
                              </div>
                              <div className="text-2xl font-bold text-purple-600">{processingResult.wordCount?.toLocaleString() || 0}</div>
                            </div>
                            
                            <div className="bg-orange-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap size={16} className="text-orange-600" />
                                <span className="font-medium text-orange-900">Processing Time</span>
                              </div>
                              <div className="text-2xl font-bold text-orange-600">{processingResult.metadata?.processingTime || 0}ms</div>
                            </div>
                          </div>
                        </div>
                        
                        {(processingResult.topics || []).length > 0 && (
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold mb-3">Topics</h4>
                            <div className="flex flex-wrap gap-2">
                              {(processingResult.topics || []).map((topic, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'chat' && processingResult && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PdfChat
                    pdfId={processingResult.id}
                    pdfTitle={processingResult.metadata.fileName || 'Document'}
                    onSessionCreate={(session) => {
                      console.log('Chat session created:', session)
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalyticsDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Call to Action for Non-Authenticated Users */}
      {!session?.user && (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Document Workflow?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of professionals who have revolutionized their PDF processing 
                with KamiScan&apos;s AI-powered technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => window.location.href = '/api/auth/signin'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket size={20} />
                  <span>Start Free Trial</span>
                </motion.button>
                
                <motion.button
                  onClick={() => window.location.href = '/pricing'}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star size={20} />
                  <span>View Pricing</span>
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Free 5 summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Instant access</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
