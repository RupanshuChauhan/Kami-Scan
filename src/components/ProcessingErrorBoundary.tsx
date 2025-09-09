'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ProcessingErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ProcessingErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ProcessingErrorBoundary extends React.Component<
  ProcessingErrorBoundaryProps,
  ProcessingErrorBoundaryState
> {
  constructor(props: ProcessingErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ProcessingErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Processing Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Processing Error
          </h3>
          <p className="text-red-600 mb-4">
            Something went wrong while processing your document. Please try again.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Error: {this.state.error?.message || 'Unknown error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              window.location.reload()
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ProcessingErrorBoundary
