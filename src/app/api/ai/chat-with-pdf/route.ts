import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface Citation {
  page: number
  text: string
  relevance: number
  context?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { pdfId, sessionId, message, history, searchMode } = await request.json()

    if (!pdfId || !message) {
      return NextResponse.json(
        { error: 'PDF ID and message are required' },
        { status: 400 }
      )
    }

    // Get PDF content and processing data
    const pdfProcessing = await prisma.pDFProcessing.findFirst({
      where: {
        userId: session.user.id,
        id: pdfId
      }
    })

    if (!pdfProcessing) {
      return NextResponse.json(
        { error: 'PDF not found or access denied' },
        { status: 404 }
      )
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        userId: session.user.id,
        role: 'user',
        content: message,
        metadata: {
          searchMode,
          timestamp: new Date()
        }
      }
    })

    // Create streaming response
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Prepare context for AI
          const contextMessages = history?.slice(-5) || [] // Last 5 messages for context
          const pdfSummary = pdfProcessing.summary
          
          let prompt = ''
          
          if (searchMode) {
            prompt = `You are helping a user search through a PDF document. The user is asking: "${message}"
            
Document summary: ${pdfSummary}

Please search for relevant information and provide a focused answer with specific citations. Include page references when possible.

Respond in a conversational manner and cite specific parts of the document.`
          } else {
            prompt = `You are an AI assistant helping a user understand a PDF document through conversation.

Document summary: ${pdfSummary}

Previous conversation context:
${contextMessages.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n')}

User question: ${message}

Please provide a helpful, conversational response about the document. Include specific citations and page references when relevant. Be engaging and educational.

Respond in JSON format:
{
  "content": "Your response text",
  "citations": [{"page": 1, "text": "quoted text", "relevance": 0.9, "context": "surrounding context"}],
  "suggestions": ["follow-up question 1", "follow-up question 2"],
  "confidence": 0.95,
  "processingTime": 1500
}`
          }

          // Stream response from Gemini
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
          const result = await model.generateContentStream(prompt)

          let fullResponse = ''
          let citations: Citation[] = []
          let suggestions: string[] = []
          let confidence = 0.9
          const startTime = Date.now()

          // Send initial metadata
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'metadata',
            metadata: {
              model: 'gemini-1.5-flash',
              searchMode,
              startTime
            }
          })}\n\n`))

          // Stream content
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            fullResponse += chunkText
            
            // Send content chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'content',
              content: chunkText
            })}\n\n`))
          }

          // Try to parse structured response if it's JSON
          try {
            const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              
              if (parsed.citations) {
                citations = parsed.citations
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: 'citations',
                  citations
                })}\n\n`))
              }
              
              if (parsed.suggestions) {
                suggestions = parsed.suggestions
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: 'suggestions',
                  suggestions
                })}\n\n`))
              }
              
              if (parsed.confidence) {
                confidence = parsed.confidence
              }
              
              // Replace full response with just the content if structured
              if (parsed.content) {
                fullResponse = parsed.content
              }
            }
          } catch {
            // Generate basic citations from the response
            citations = generateBasicCitations(fullResponse, pdfProcessing.summary)
          }

          const processingTime = Date.now() - startTime

          // Send final metadata
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'metadata',
            metadata: {
              processingTime,
              confidence,
              tokensUsed: Math.ceil(fullResponse.length / 4) // Rough estimate
            }
          })}\n\n`))

          // Save assistant message
          await prisma.chatMessage.create({
            data: {
              sessionId: sessionId,
              userId: session.user.id,
              role: 'assistant',
              content: fullResponse,
              metadata: {
                citations,
                suggestions,
                confidence,
                processingTime,
                model: 'gemini-1.5-flash',
                searchMode,
                userMessageId: userMessage.id
              }
            }
          })

          // Update session activity
          if (sessionId) {
            await prisma.chatSession.update({
              where: { id: sessionId },
              data: { lastActivity: new Date() }
            })
          }

          controller.close()

        } catch (error) {
          console.error('Chat streaming error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: 'Failed to process your message. Please try again.'
          })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

function generateBasicCitations(response: string, documentSummary: string): Citation[] {
  // Simple citation generation based on document summary
  const citations: Citation[] = []
  const sentences = documentSummary.split('. ').slice(0, 3)
  
  sentences.forEach((sentence, index) => {
    if (sentence.length > 50) {
      citations.push({
        page: index + 1,
        text: sentence.trim(),
        relevance: 0.7 - (index * 0.1),
        context: `Context from page ${index + 1}`
      })
    }
  })
  
  return citations
}
