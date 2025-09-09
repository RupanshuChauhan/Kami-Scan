'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SimplePDFUploader from '@/components/SimplePDFUploader'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface DebugInfo {
  timestamp: string
  userAgent: string
  sessionStatus: string
  sessionData: { email?: string; name?: string } | null
  windowLocation: string
  environment: string | undefined
}

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Collect debug information
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      sessionStatus: status,
      sessionData: session ? { 
        email: session.user?.email || undefined, 
        name: session.user?.name || undefined 
      } : null,
      windowLocation: typeof window !== 'undefined' ? window.location.href : 'unknown',
      environment: process.env.NODE_ENV,
    }
    setDebugInfo(info)
  }, [session, status])

  const testApiEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      return { success: true, status: response.status, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  const runDiagnostics = async () => {
    setError(null)
    const tests = [
      { name: 'Auth Session', endpoint: '/api/auth/session' },
      { name: 'User Stats', endpoint: '/api/user/stats' },
    ]

    for (const test of tests) {
      const result = await testApiEndpoint(test.endpoint)
      console.log(`${test.name} test:`, result)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            KamiScan Debug Page
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Session Info</h2>
              <div className="bg-gray-900/50 rounded p-4 text-sm">
                <div className="flex items-center mb-2">
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : status === 'authenticated' ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                  )}
                  <span className="text-gray-300">Status: {status}</span>
                </div>
                {session?.user && (
                  <div className="text-gray-400">
                    <p>Email: {session.user.email}</p>
                    <p>Name: {session.user.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Debug Info</h2>
              <div className="bg-gray-900/50 rounded p-4 text-sm">
                {debugInfo && (
                  <pre className="text-gray-400 text-xs overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={runDiagnostics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Run API Diagnostics
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">PDF Upload Test</h2>
          <SimplePDFUploader 
            onError={(err) => setError(err)}
            onSuccess={() => setError(null)}
          />
          
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300">Error: {error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
