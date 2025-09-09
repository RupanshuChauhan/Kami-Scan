import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ProcessingOptions {
  type: 'summary' | 'qa' | 'translate' | 'analyze' | 'extract' | 'compare'
  language?: string
  outputFormat?: 'text' | 'bullets' | 'outline' | 'mindmap' | 'flashcards'
  complexity?: 'simple' | 'detailed' | 'expert'
  focusAreas?: string[]
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('POST /api/ai/advanced-process - Request received')
    
    const session = await auth()
    
    if (!session?.user?.email) {
      console.log('POST /api/ai/advanced-process - Authentication failed')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate request body exists
    if (!request.body) {
      console.log('POST /api/ai/advanced-process - No request body')
      return NextResponse.json({ error: 'No request body provided' }, { status: 400 })
    }

    // Parse multipart form data with error handling
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (formDataError) {
      console.error('POST /api/ai/advanced-process - FormData parsing error:', formDataError)
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }
    
    const file = formData.get('file') as File
    const optionsString = formData.get('options') as string
    
    if (!file) {
      console.log('POST /api/ai/advanced-process - No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Parse options with error handling
    let options: ProcessingOptions
    try {
      options = optionsString ? JSON.parse(optionsString) : { type: 'summary' }
    } catch (parseError) {
      console.error('POST /api/ai/advanced-process - Options parsing error:', parseError)
      options = { type: 'summary' }
    }

    console.log('POST /api/ai/advanced-process - Processing with options:', options)

    // Convert file to buffer with error handling
    let buffer: Buffer
    try {
      buffer = Buffer.from(await file.arrayBuffer())
    } catch (bufferError) {
      console.error('POST /api/ai/advanced-process - Buffer conversion error:', bufferError)
      return NextResponse.json(
        { error: 'Failed to process file data. Please try uploading the file again.' },
        { status: 400 }
      )
    }
    
    // Extract text from PDF with better error handling
    let extractedText = ''
    let pageCount = 0
    
    try {
      console.log('POST /api/ai/advanced-process - Starting text extraction')
      
      if (file.type === 'application/pdf') {
        // Dynamic import of pdf-parse to avoid module resolution issues
        const pdfParse = (await import('pdf-parse')).default
        const pdfData = await pdfParse(buffer)
        extractedText = pdfData.text || ''
        pageCount = pdfData.numpages || 1
        
        console.log('POST /api/ai/advanced-process - PDF parsing successful:', {
          textLength: extractedText.length,
          pageCount
        })
      } else {
        // Handle other document types
        extractedText = buffer.toString('utf8')
        pageCount = 1
        
        console.log('POST /api/ai/advanced-process - Text document processed:', {
          textLength: extractedText.length
        })
      }
    } catch (error) {
      console.error('POST /api/ai/advanced-process - Text extraction error:', error)
      return NextResponse.json(
        { error: 'Failed to extract text from document. Please ensure the file is a valid, readable PDF.' },
        { status: 400 }
      )
    }

    if (!extractedText.trim()) {
      console.log('POST /api/ai/advanced-process - No text content found')
      return NextResponse.json(
        { error: 'No text content found in document. Please ensure the PDF contains readable text.' },
        { status: 400 }
      )
    }

    // Generate mock result with better data validation
    try {
      console.log('POST /api/ai/advanced-process - Generating mock result')
      
      const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length
      const processingTime = Date.now() - startTime
      
      const mockResult = {
        id: `proc_${Date.now()}`,
        summary: `This document has been successfully processed using ${options.type} mode. The AI processing system extracted ${wordCount} words from ${pageCount} page(s) and generated this comprehensive analysis.`,
        keyPoints: [
          "Document successfully uploaded and processed",
          `Text extraction completed: ${wordCount} words`,
          `Processing mode: ${options.type}`,
          `File size: ${(buffer.length / 1024).toFixed(1)} KB`,
          "AI processing pipeline functional"
        ],
        sentiment: 'positive' as const,
        readingTime: Math.max(1, Math.ceil(wordCount / 200)), // 200 words per minute reading speed
        wordCount: wordCount,
        topics: ['Document Processing', 'AI Analysis', options.type.charAt(0).toUpperCase() + options.type.slice(1)],
        confidence: 95,
        citations: [
          { 
            page: 1, 
            text: extractedText.substring(0, 150) + (extractedText.length > 150 ? '...' : ''), 
            relevance: 0.95 
          }
        ],
        metadata: {
          fileName: file.name,
          processingTime: processingTime,
          wordCount: wordCount,
          pageCount: pageCount
        }
      }

      console.log('POST /api/ai/advanced-process - Mock result generated successfully:', {
        id: mockResult.id,
        wordCount: mockResult.wordCount,
        processingTime: mockResult.metadata.processingTime
      })

      // Save processing result to database
      try {
        // Get user info first
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true }
        })

        if (user) {
          await prisma.pDFProcessing.create({
            data: {
              userId: user.id,
              fileName: file.name,
              fileSize: file.size,
              summary: mockResult.summary,
              metadata: {
                processingType: options.type,
                wordCount: wordCount,
                processingTime: processingTime,
                confidence: mockResult.confidence
              }
            }
          })

          // Increment user usage count
          await prisma.user.update({
            where: { id: user.id },
            data: {
              usageCount: { increment: 1 }
            }
          })

          console.log('POST /api/ai/advanced-process - Result saved to database')
        }
      } catch (dbError) {
        console.error('POST /api/ai/advanced-process - Database save error:', dbError)
        // Continue even if database save fails
      }

      return NextResponse.json(mockResult)
    } catch (resultError) {
      console.error('POST /api/ai/advanced-process - Error generating result:', resultError)
      return NextResponse.json(
        { error: 'Failed to generate processing result' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('POST /api/ai/advanced-process - Unexpected error:', error)
    
    // Provide specific error messages based on error type
    if (error instanceof Error) {
      console.error('POST /api/ai/advanced-process - Error details:', {
        message: error.message,
        stack: error.stack
      })
      
      // Check for specific error types
      if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('file') || error.message.includes('upload')) {
        return NextResponse.json(
          { error: `File processing failed: ${error.message}` },
          { status: 400 }
        )
      }
      
      // For any other error, return a generic message but log the details
      return NextResponse.json(
        { error: 'Internal server error. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
