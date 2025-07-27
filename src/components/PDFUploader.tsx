'use client'

import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { Upload, FileText, Sparkles, Download, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PDFUploader() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)
    
    try {
      // Simulate AI processing with zero latency feel
      toast.loading('🤖 AI is analyzing your PDF...', { id: 'processing' })
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to process PDF')
      }

      const result = await response.json()
      setSummary(result.summary)
      toast.success('✅ PDF processed successfully!', { id: 'processing' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF. Please try again.'
      toast.error(`❌ ${errorMessage}`, { id: 'processing' })
      console.error('Error processing PDF:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 10485760, // 10MB
  })

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-purple-500 bg-purple-500/10 scale-102' 
            : 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500 hover:bg-purple-500/10'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative"
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
          >
            {isProcessing ? (
              <Zap className="w-16 h-16 text-purple-500" />
            ) : (
              <Upload className="w-16 h-16 text-purple-500" />
            )}
            <motion.div
              className="absolute inset-0 bg-purple-500 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isProcessing ? 'Processing Magic...' : 'Drop your PDF here'}
            </h3>
            <p className="text-gray-400">
              {isProcessing 
                ? 'Our AI is working its magic on your document' 
                : isDragActive 
                  ? 'Release to upload your PDF' 
                  : 'Or click to select a PDF file (Max 10MB)'
              }
            </p>
          </div>

          {!isProcessing && (
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium relative overflow-hidden"
              variants={magicButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Choose PDF File</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* File Info */}
      {uploadedFile && (
        <motion.div
          className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">{uploadedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {summary && (
              <motion.button
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2"
                variants={magicButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  const blob = new Blob([summary], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${uploadedFile.name}_summary.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="w-4 h-4" />
                <span>Download Summary</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Summary Results */}
      {summary && (
        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">AI Generated Summary</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </motion.div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4 text-purple-400">
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
