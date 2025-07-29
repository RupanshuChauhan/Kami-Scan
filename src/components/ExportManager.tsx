'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, FileText, Share2, Copy, Mail, Link2, 
  FileImage, FileSpreadsheet, FileCode2, Check,
  Bookmark
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'md' | 'json' | 'csv' | 'pptx'
  includeMetadata: boolean
  includeCitations: boolean
  includeOriginalText: boolean
  template: 'standard' | 'academic' | 'business' | 'presentation'
  language: string
}

interface ProcessingResult {
  id: string
  summary: string
  keyPoints: string[]
  topics: string[]
  citations?: Array<{ page: number; text: string; relevance: number }>
  metadata: {
    fileName?: string
    processingTime: number
    wordCount: number
    pageCount: number
  }
}

interface ExportManagerProps {
  result: ProcessingResult
  onExport?: (format: string, url: string) => void
  className?: string
}

export default function ExportManager({ 
  result, 
  onExport,
  className = '' 
}: ExportManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  const [shareMode, setShareMode] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeMetadata: true,
    includeCitations: true,
    includeOriginalText: false,
    template: 'standard',
    language: 'en'
  })

  const exportFormats = [
    {
      format: 'pdf' as const,
      icon: FileText,
      label: 'PDF Document',
      description: 'Professional PDF with formatting',
      color: 'text-red-600 bg-red-50'
    },
    {
      format: 'docx' as const,
      icon: FileText,
      label: 'Word Document',
      description: 'Editable Microsoft Word format',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      format: 'pptx' as const,
      icon: FileImage,
      label: 'PowerPoint',
      description: 'Presentation slides format',
      color: 'text-orange-600 bg-orange-50'
    },
    {
      format: 'md' as const,
      icon: FileCode2,
      label: 'Markdown',
      description: 'Plain text with markdown formatting',
      color: 'text-gray-600 bg-gray-50'
    },
    {
      format: 'json' as const,
      icon: FileCode2,
      label: 'JSON Data',
      description: 'Structured data format',
      color: 'text-green-600 bg-green-50'
    },
    {
      format: 'csv' as const,
      icon: FileSpreadsheet,
      label: 'CSV Export',
      description: 'Spreadsheet compatible format',
      color: 'text-emerald-600 bg-emerald-50'
    }
  ]

  const templates = [
    { value: 'standard', label: 'Standard Report', description: 'Clean, professional layout' },
    { value: 'academic', label: 'Academic Paper', description: 'Citation-heavy, research format' },
    { value: 'business', label: 'Business Brief', description: 'Executive summary style' },
    { value: 'presentation', label: 'Presentation', description: 'Slide-ready format' }
  ]

  const handleExport = async (format: string) => {
    setExporting(format)
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultId: result.id,
          format,
          options: exportOptions
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Download file
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.metadata.fileName || 'summary'}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Successfully exported as ${format.toUpperCase()}`)
      onExport?.(format, url)
      
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(null)
    }
  }

  const handleShare = async (method: 'link' | 'email' | 'copy') => {
    try {
      const shareData = {
        title: `PDF Summary - ${result.metadata.fileName}`,
        text: result.summary.substring(0, 200) + '...',
        url: window.location.href
      }

      switch (method) {
        case 'link':
          if (navigator.share) {
            await navigator.share(shareData)
          } else {
            await navigator.clipboard.writeText(shareData.url)
            toast.success('Link copied to clipboard!')
          }
          break
          
        case 'email':
          const emailBody = `Check out this PDF summary:\n\n${result.summary}\n\nView full analysis: ${shareData.url}`
          window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(emailBody)}`)
          break
          
        case 'copy':
          const copyText = `${shareData.title}\n\n${result.summary}\n\nKey Points:\n${result.keyPoints.map(point => `• ${point}`).join('\n')}`
          await navigator.clipboard.writeText(copyText)
          toast.success('Content copied to clipboard!')
          break
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Sharing failed')
    }
  }

  const saveToLibrary = async () => {
    try {
      await fetch('/api/library/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultId: result.id,
          tags: result.topics,
          starred: false
        })
      })
      
      toast.success('Saved to your library!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save to library')
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Export Button */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download size={16} />
          <span>Export</span>
        </motion.button>

        <motion.button
          onClick={() => setShareMode(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 size={16} />
          <span>Share</span>
        </motion.button>

        <motion.button
          onClick={saveToLibrary}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Bookmark size={16} />
        </motion.button>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Export Options</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Format Selection */}
                <div>
                  <h4 className="font-semibold mb-4">Choose Format</h4>
                  <div className="space-y-3">
                    {exportFormats.map(({ format, icon: Icon, label, description, color }) => (
                      <motion.button
                        key={format}
                        onClick={() => setExportOptions(prev => ({ ...prev, format }))}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          exportOptions.format === format
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        disabled={exporting === format}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{description}</div>
                          </div>
                          {exportOptions.format === format && (
                            <Check size={20} className="text-blue-600" />
                          )}
                          {exporting === format && (
                            <motion.div
                              className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Template Style</h4>
                    <div className="space-y-2">
                      {templates.map(({ value, label, description }) => (
                        <label key={value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="template"
                            value={value}
                            checked={exportOptions.template === value}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, template: e.target.value as 'standard' | 'academic' | 'business' | 'presentation' }))}
                            className="text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Include Options</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'includeMetadata', label: 'Document Metadata', desc: 'File info, processing time, etc.' },
                        { key: 'includeCitations', label: 'Source Citations', desc: 'Page references and quotes' },
                        { key: 'includeOriginalText', label: 'Original Text', desc: 'Full document content' }
                      ].map(({ key, label, desc }) => (
                        <label key={key} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exportOptions[key as keyof ExportOptions] as boolean}
                            onChange={(e) => setExportOptions(prev => ({ 
                              ...prev, 
                              [key]: e.target.checked 
                            }))}
                            className="mt-1 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Language</h4>
                    <select
                      value={exportOptions.language}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Select export language"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Export as {exportOptions.format.toUpperCase()} • {exportOptions.template} template
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={() => handleExport(exportOptions.format)}
                    disabled={!!exporting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {exporting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Export Now</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShareMode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Share Summary</h3>
                <button
                  onClick={() => setShareMode(false)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={() => handleShare('link')}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Link2 size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Share Link</div>
                      <div className="text-sm text-gray-600">Copy shareable link</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleShare('email')}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Email Summary</div>
                      <div className="text-sm text-gray-600">Send via email</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleShare('copy')}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Copy size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Copy Content</div>
                      <div className="text-sm text-gray-600">Copy to clipboard</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
