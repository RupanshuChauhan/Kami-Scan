'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  Send, Bot, User, FileText, Copy, ThumbsUp,
  Bookmark, Search, MoreVertical,
  Sparkles, Brain, Zap, Clock, Quote
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  citations?: Citation[]
  metadata?: {
    processingTime?: number
    confidence?: number
    tokensUsed?: number
    model?: string
  }
  reactions?: {
    helpful: boolean
    saved: boolean
  }
  suggestions?: string[]
}

interface Citation {
  page: number
  text: string
  relevance: number
  coordinates?: { x: number; y: number; width: number; height: number }
  context?: string
}

interface ChatSession {
  id: string
  pdfId: string
  title: string
  createdAt: Date
  messageCount: number
  lastActivity: Date
}

interface PdfChatProps {
  pdfId: string
  pdfTitle: string
  pdfUrl?: string
  className?: string
  onSessionCreate?: (session: ChatSession) => void
}

export default function PdfChat({ 
  pdfId, 
  pdfTitle, 
  pdfUrl,
  className = '',
  onSessionCreate 
}: PdfChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [suggestions] = useState([
    "Summarize the main points",
    "What are the key conclusions?",
    "Explain complex concepts",
    "Find relevant statistics",
    "Compare different sections"
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    initializeChatSession()
  }, [pdfId, initializeChatSession])

  const initializeChatSession = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/chat-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId, pdfTitle })
      })
      
      const sessionData = await response.json()
      setChatSession(sessionData.session)
      
      if (sessionData.messages?.length > 0) {
        setMessages(sessionData.messages)
      } else {
        // Add welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'system',
          content: `Welcome! I'm ready to help you understand "${pdfTitle}". Ask me anything about the document - I can summarize, explain concepts, find specific information, or help you analyze the content.`,
          timestamp: new Date(),
          suggestions: suggestions.slice(0, 3)
        }
        setMessages([welcomeMessage])
      }
      
      onSessionCreate?.(sessionData.session)
    } catch (error) {
      console.error('Failed to initialize chat session:', error)
      toast.error('Failed to start chat session')
    }
  }, [pdfId, pdfTitle, suggestions, onSessionCreate])

  const sendMessage = useCallback(async (messageText?: string) => {
    const messageContent = messageText || input.trim()
    if (!messageContent || loading || !session?.user) return

    if (!session?.user) {
      toast.error('Please sign in to chat with the PDF')
      return
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setIsTyping(true)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/ai/chat-with-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfId,
          sessionId: chatSession?.id,
          message: messageContent,
          history: messages.slice(-10), // Last 10 messages for context
          searchMode
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        citations: [],
        metadata: { processingTime: 0, confidence: 0 }
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)

      // Stream the response
      let fullContent = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                fullContent += data.content
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: fullContent }
                    : msg
                ))
              } else if (data.type === 'citations') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, citations: data.citations }
                    : msg
                ))
              } else if (data.type === 'metadata') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, metadata: data.metadata }
                    : msg
                ))
              } else if (data.type === 'suggestions') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, suggestions: data.suggestions }
                    : msg
                ))
              }
            } catch {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was cancelled
      }
      
      console.error('Chat error:', error)
      toast.error('Failed to get response. Please try again.')
      
      // Remove the failed message
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }, [input, loading, session, pdfId, chatSession, messages, searchMode])

  const handleReaction = async (messageId: string, reaction: 'helpful' | 'saved') => {
    try {
      await fetch('/api/ai/chat-reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reaction })
      })

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: { 
                ...msg.reactions, 
                [reaction]: !msg.reactions?.[reaction] 
              }
            }
          : msg
      ))
    } catch (error) {
      console.error('Failed to save reaction:', error)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setLoading(false)
      setIsTyping(false)
    }
  }

  return (
    <div className={`flex flex-col h-[700px] bg-white rounded-2xl shadow-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Chat with PDF</h3>
            <p className="text-sm text-gray-600 truncate max-w-xs">{pdfTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchMode(!searchMode)}
            className={`p-2 rounded-lg transition-colors ${
              searchMode 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Search Mode"
          >
            <Search size={16} />
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : message.role === 'system'
                  ? 'bg-purple-100'
                  : 'bg-gray-100'
              }`}>
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : message.role === 'system' ? (
                  <Sparkles size={16} className="text-purple-600" />
                ) : (
                  <Bot size={16} className="text-gray-600" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.role === 'system'
                    ? 'bg-purple-50 text-purple-900 border border-purple-200'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">Sources:</p>
                      <div className="space-y-2">
                        {message.citations.map((citation, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => setSelectedCitation(citation)}
                            className="block w-full text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Quote size={12} className="text-blue-600" />
                              <span className="text-xs font-medium text-blue-600">
                                Page {citation.page}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round(citation.relevance * 100)}% relevant
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 line-clamp-2">
                              &quot;{citation.text.substring(0, 120)}...&quot;
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {message.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
                      {message.metadata.processingTime && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{message.metadata.processingTime}ms</span>
                        </div>
                      )}
                      {message.metadata.confidence && (
                        <div className="flex items-center gap-1">
                          <Brain size={12} />
                          <span>{Math.round(message.metadata.confidence * 100)}% confidence</span>
                        </div>
                      )}
                      {message.metadata.model && (
                        <div className="flex items-center gap-1">
                          <Zap size={12} />
                          <span>{message.metadata.model}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Copy message"
                    >
                      <Copy size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleReaction(message.id, 'helpful')}
                      className={`p-1.5 rounded-md transition-colors ${
                        message.reactions?.helpful
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleReaction(message.id, 'saved')}
                      className={`p-1.5 rounded-md transition-colors ${
                        message.reactions?.saved
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Save message"
                    >
                      <Bookmark size={14} />
                    </button>
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(suggestion)}
                          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Bot size={16} className="text-gray-600" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={searchMode ? "Search in the document..." : "Ask about this PDF..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            
            {searchMode && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {loading ? (
            <button
              onClick={stopGeneration}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>

      {/* Citation Modal */}
      <AnimatePresence>
        {selectedCitation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCitation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Citation Details</h3>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page {selectedCitation.page}</p>
                  <p className="text-sm text-gray-500">Relevance: {Math.round(selectedCitation.relevance * 100)}%</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">&quot;{selectedCitation.text}&quot;</p>
                </div>
                
                {selectedCitation.context && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Context:</p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-900 text-sm">{selectedCitation.context}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(selectedCitation.text)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Copy Citation
                  </button>
                  {pdfUrl && (
                    <button
                      onClick={() => window.open(`${pdfUrl}#page=${selectedCitation.page}`, '_blank')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View in PDF
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
