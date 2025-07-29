'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useSession } from 'next-auth/react'
import { 
  Upload, FileText, Brain, Languages, BarChart3, 
  Zap, Clock, CheckCircle, AlertCircle, Download,
  MessageSquare, Share2, Eye, Settings 
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProcessingOptions {
  type: 'summary' | 'qa' | 'translate' | 'analyze' | 'extract' | 'compare'
  language?: string
  outputFormat?: 'text' | 'bullets' | 'outline' | 'mindmap' | 'flashcards'
  complexity?: 'simple' | 'detailed' | 'expert'
  focusAreas?: string[]
}

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
    processingTime: number
    aiModel: string
    timestamp: Date
    fileSize: number
    pageCount: number
  }
  exportUrls?: {
    pdf?: string
    docx?: string
    pptx?: string
    json?: string
  }
}

interface AdvancedPdfProcessorProps {
  onProcessComplete?: (result: ProcessingResult) => void
  className?: string
}

export default function AdvancedPdfProcessor({ 
  onProcessComplete, 
  className = '' 
}: AdvancedPdfProcessorProps) {
  const { data: session } = useSession()
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [options, setOptions] = useState<ProcessingOptions>({
    type: 'summary',
    language: 'auto-detect',
    outputFormat: 'text',
    complexity: 'detailed',
    focusAreas: []
  })
  const [results, setResults] = useState<ProcessingResult[]>([])
  const [activeResult, setActiveResult] = useState<ProcessingResult | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB')
      return
    }

    await processDocument(file)
  }, [options])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  })

  const processDocument = async (file: File) => {
    if (!session?.user) {
      toast.error('Please sign in to process documents')
      return
    }

    setProcessing(true)
    setProgress(0)
    setCurrentStep('Uploading document...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('options', JSON.stringify(options))

    try {
      const response = await fetch('/api/ai/advanced-process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Processing failed')
      }

      // Simulate real-time progress updates
      const steps = [
        'Extracting text content...',
        'Analyzing document structure...',
        'Processing with AI...',
        'Generating insights...',
        'Creating export formats...',
        'Finalizing results...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i])
        setProgress((i + 1) * 16.67)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      const result = await response.json()
      
      setResults(prev => [result, ...prev])
      setActiveResult(result)
      onProcessComplete?.(result)
      
      toast.success('Document processed successfully!')
      
    } catch (error) {
      console.error('Processing error:', error)
      toast.error(error instanceof Error ? error.message : 'Processing failed')
    } finally {
      setProcessing(false)
      setProgress(0)
      setCurrentStep('')
    }
  }

  const processingTypes = [
    {
      type: 'summary' as const,
      icon: FileText,
      label: 'Smart Summary',
      description: 'AI-powered document summarization with key insights'
    },
    {
      type: 'qa' as const,
      icon: MessageSquare,
      label: 'Q&A Mode',
      description: 'Interactive question-answering with the document'
    },
    {
      type: 'translate' as const,
      icon: Languages,
      label: 'Translate',
      description: 'Multi-language translation with context preservation'
    },
    {
      type: 'analyze' as const,
      icon: BarChart3,
      label: 'Deep Analysis',
      description: 'Comprehensive analysis with sentiment and topics'
    },
    {
      type: 'extract' as const,
      icon: Eye,
      label: 'Extract Data',
      description: 'Extract tables, figures, and key data points'
    },
    {
      type: 'compare' as const,
      icon: Share2,
      label: 'Compare',
      description: 'Compare with previous documents for insights'
    }
  ]

  const exportFormats = [
    { format: 'text', label: 'Plain Text', icon: FileText },
    { format: 'bullets', label: 'Bullet Points', icon: CheckCircle },
    { format: 'outline', label: 'Structured Outline', icon: BarChart3 },
    { format: 'mindmap', label: 'Mind Map', icon: Brain },
    { format: 'flashcards', label: 'Flashcards', icon: Zap }
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Processing Options Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Processing Options</h3>
        
        {/* Processing Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Processing Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {processingTypes.map(({ type, icon: Icon, label, description }) => (
              <motion.button
                key={type}
                onClick={() => setOptions(prev => ({ ...prev, type }))}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  options.type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} className="mb-2" />
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs opacity-75 mt-1">{description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Output Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Output Format
          </label>
          <div className="flex flex-wrap gap-2">
            {exportFormats.map(({ format, label, icon: Icon }) => (
              <button
                key={format}
                onClick={() => setOptions(prev => ({ ...prev, outputFormat: format as any }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  options.outputFormat === format
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Complexity Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Detail Level
          </label>
          <div className="flex gap-2">
            {[
              { value: 'simple', label: 'Simple', desc: 'Quick overview' },
              { value: 'detailed', label: 'Detailed', desc: 'Comprehensive analysis' },
              { value: 'expert', label: 'Expert', desc: 'Technical deep-dive' }
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setOptions(prev => ({ ...prev, complexity: value as any }))}
                className={`flex-1 p-3 rounded-lg border transition-all text-center ${
                  options.complexity === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs opacity-75">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* File Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${processing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          <motion.div
            className="space-y-4"
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          >
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop your document here' : 'Upload your document'}
              </h3>
              <p className="text-gray-600">
                Drag & drop or click to browse • PDF, DOC, DOCX up to 50MB
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-500" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={16} className="text-yellow-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-blue-500" />
                <span>Fast Results</span>
              </div>
            </div>
          </motion.div>

          {/* Processing Overlay */}
          <AnimatePresence>
            {processing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <h4 className="font-semibold text-gray-900">{currentStep}</h4>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 text-center">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results Display */}
      <AnimatePresence>
        {activeResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Processing Results</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Confidence: {activeResult.confidence}%
                </span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{activeResult.summary}</p>
                </div>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Points</h4>
                <ul className="space-y-2">
                  {activeResult.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{activeResult.wordCount}</div>
                  <div className="text-sm text-gray-500">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activeResult.readingTime}m</div>
                  <div className="text-sm text-gray-500">Reading Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{activeResult.metadata.pageCount}</div>
                  <div className="text-sm text-gray-500">Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{activeResult.metadata.processingTime}s</div>
                  <div className="text-sm text-gray-500">Processing</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
