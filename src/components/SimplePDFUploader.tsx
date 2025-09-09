'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface SimplePDFUploaderProps {
  onError?: (error: string) => void
  onSuccess?: (summary: string) => void
}

export default function SimplePDFUploader({ onError, onSuccess }: SimplePDFUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      const error = 'Please upload a PDF file'
      toast.error(error)
      onError?.(error)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      const error = 'File size must be less than 10MB'
      toast.error(error)
      onError?.(error)
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('SimplePDFUploader: Sending request to /api/summarize')
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      })

      console.log('SimplePDFUploader: Response received', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('SimplePDFUploader: Error response text:', errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (parseError) {
          console.error('SimplePDFUploader: Failed to parse error response:', parseError)
          errorData = { error: errorText || 'Unknown error' }
        }
        
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`)
      }

      const result = await response.json()
      console.log('SimplePDFUploader: Success response:', result)
      
      setSummary(result.summary || 'No summary available')
      onSuccess?.(result.summary)
      toast.success('PDF processed successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF'
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-8">
        <div className="text-center">
          <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Simple PDF Uploader
          </h3>
          <p className="text-gray-400 mb-6">
            Upload your PDF file for AI-powered summarization
          </p>
          
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isProcessing}
              title="Upload PDF file"
              placeholder="Choose PDF file"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-blue-600 file:text-white
                file:hover:bg-blue-700
                file:cursor-pointer cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          {isProcessing && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400">Processing PDF...</span>
            </div>
          )}
        </div>
      </div>
      
      {summary && (
        <div className="mt-6 bg-gray-800/50 rounded-lg border border-gray-600 p-6">
          <h4 className="text-lg font-semibold text-white mb-3">Summary</h4>
          <div className="text-gray-300 whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  )
}
