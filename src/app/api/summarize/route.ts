import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getConfig } from '@/lib/config'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Initialize Gemini AI with config validation
const config = getConfig()
const genAI = config.config.GEMINI_API_KEY ? new GoogleGenerativeAI(config.config.GEMINI_API_KEY) : null

// Enhanced PDF parsing with better error handling
async function parsePDF(buffer: Buffer) {
  try {
    const pdf = await import('pdf-parse')
    const options = {
      // Disable internal errors to handle them ourselves
      verbosity: 0,
      // Set page limit to prevent memory issues
      max: 10,
    }
    return await pdf.default(buffer, options)
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('PDF_PARSE_FAILED')
  }
}

// Alternative text extraction using simple PDF text patterns
function extractTextFallback(buffer: Buffer): string {
  try {
    const text = buffer.toString('binary')
    // Look for text patterns in PDF
    const textMatches = text.match(/\(([^)]+)\)/g)
    if (textMatches) {
      const extractedText = textMatches
        .map(match => match.slice(1, -1))
        .filter(text => text.length > 3 && /[a-zA-Z]/.test(text))
        .join(' ')
      
      if (extractedText.length > 50) {
        return extractedText
      }
    }
    throw new Error('FALLBACK_FAILED')
  } catch {
    throw new Error('FALLBACK_FAILED')
  }
}

// Demo summary generator for when PDF parsing fails
function generateDemoSummary(filename: string): string {
  return `📄 **Document Summary for ${filename}**

**Key Highlights:**
• Document processing is currently in demo mode due to PDF parsing limitations
• This is a sample summary showing the expected output format
• Real AI analysis will be available once text extraction is successful

**Main Sections:**
1. **Demo Mode Notice** - Indicates that actual PDF parsing was not possible
2. **Expected Format** - Shows how real summaries will be structured
3. **Next Steps** - Guidance for successful PDF processing

**Critical Points:**
• Please try uploading a different PDF file for real analysis
• Ensure your PDF contains selectable text (not scanned images)
• File should be under 10MB and not password-protected

**Actionable Insights:**
For best results, use PDFs that contain actual text rather than scanned images. Consider using OCR software if your document is image-based.

*Note: This is a demo summary. Upload a text-based PDF to see real AI analysis.*`
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Add comprehensive error handling and logging
    console.log('POST /api/summarize - Request received')
    
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      console.log('POST /api/summarize - No authenticated user')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Check user usage limits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        usageCount: true, 
        usageLimit: true, 
        subscription: true,
        lastResetDate: true
      }
    })
    
    if (!user) {
      console.log('POST /api/summarize - User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Check if usage limit is exceeded
    const now = new Date()
    const lastReset = new Date(user.lastResetDate)
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))
    
    // Reset monthly usage if more than 30 days have passed
    if (daysSinceReset >= 30) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          usageCount: 0,
          lastResetDate: now
        }
      })
      user.usageCount = 0
    }
    
    if (user.usageCount >= user.usageLimit && user.subscription === 'free') {
      console.log('POST /api/summarize - Usage limit exceeded')
      return NextResponse.json({ 
        error: `Monthly usage limit (${user.usageLimit}) exceeded. Please upgrade your plan.` 
      }, { status: 429 })
    }
    
    // Validate request body exists
    if (!request.body) {
      console.log('POST /api/summarize - No request body')
      return NextResponse.json({ error: 'No request body provided' }, { status: 400 })
    }
    
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (formDataError) {
      console.error('POST /api/summarize - FormData parsing error:', formDataError)
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }
    
    const file = formData.get('file') as File

    if (!file) {
      console.log('POST /api/summarize - No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      console.log('POST /api/summarize - Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('POST /api/summarize - File too large:', file.size)
      return NextResponse.json({ 
        error: 'File too large. Please upload a PDF smaller than 10MB.' 
      }, { status: 400 })
    }

    console.log('POST /api/summarize - Processing file:', file.name, 'Size:', file.size)

    // Convert file to buffer for PDF parsing
    let arrayBuffer: ArrayBuffer
    let buffer: Buffer
    
    try {
      arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } catch (bufferError) {
      console.error('POST /api/summarize - Buffer conversion error:', bufferError)
      return NextResponse.json(
        { error: 'Failed to process file data. Please try uploading the file again.' },
        { status: 400 }
      )
    }

    let extractedText = ''
    let parseMethod = 'unknown'

    // Try primary PDF parsing method
    try {
      console.log('POST /api/summarize - Attempting PDF parsing...')
      const pdfData = await parsePDF(buffer)
      extractedText = pdfData.text
      parseMethod = 'pdf-parse'
      console.log('POST /api/summarize - PDF parsing successful, extracted', extractedText.length, 'characters')
    } catch (primaryError) {
      console.log('POST /api/summarize - Primary PDF parsing failed:', primaryError)
      
      // Try fallback text extraction
      try {
        console.log('POST /api/summarize - Attempting fallback parsing...')
        extractedText = extractTextFallback(buffer)
        parseMethod = 'fallback'
        console.log('POST /api/summarize - Fallback parsing successful')
      } catch (fallbackError) {
        console.log('POST /api/summarize - Fallback parsing also failed:', fallbackError)
        
        // Final fallback: Generate a demo summary based on filename if all parsing fails
        console.log('POST /api/summarize - Using demo mode')
        const demoSummary = generateDemoSummary(file.name)
        return NextResponse.json({
          summary: demoSummary,
          originalFileName: file.name,
          fileSize: file.size,
          textLength: 0,
          parseMethod: 'demo-mode',
          processedAt: new Date().toISOString(),
          aiPowered: false,
          note: 'Demo mode: Could not extract text from PDF. Showing sample output.'
        })
      }
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 10) {
      console.log('POST /api/summarize - Insufficient text extracted:', extractedText?.length || 0)
      return NextResponse.json({ 
        error: 'The PDF appears to contain very little text or may be image-based. Please ensure your PDF contains readable text content.' 
      }, { status: 400 })
    }

    console.log('POST /api/summarize - Text validation passed')

    // Clean and prepare text for AI processing
    const cleanedText = extractedText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?;:()\-"']/g, '') // Remove special characters
      .trim()

    console.log('POST /api/summarize - Text cleaned, length:', cleanedText.length)

    // Check if Gemini API key is available
    if (!config.config.GEMINI_API_KEY || !genAI) {
      console.log('POST /api/summarize - GEMINI_API_KEY not found, using demo summary')
      const demoSummary = generateDemoSummary(file.name)
      return NextResponse.json({
        summary: demoSummary,
        originalFileName: file.name,
        fileSize: file.size,
        textLength: extractedText.length,
        parseMethod: 'demo-no-api-key',
        processedAt: new Date().toISOString(),
        aiPowered: false,
        note: 'Demo mode: API key not configured. Showing sample output.'
      })
    }

    // Generate AI summary using Gemini
    console.log('POST /api/summarize - Generating AI summary...')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `Please provide a comprehensive and professional summary of the following document text. 
    Structure your response exactly like this:

    📄 **Document Summary**
    
    **Key Highlights:**
    • [First main point]
    • [Second main point]  
    • [Third main point]
    
    **Main Sections:**
    1. **[Section Name]** - [Brief description]
    2. **[Section Name]** - [Brief description]
    3. **[Section Name]** - [Brief description]
    
    **Critical Points:**
    • [Important finding or conclusion]
    • [Key recommendation or insight]
    • [Significant data or result]
    
    **Actionable Insights:**
    [1-2 sentences about what can be done based on this document]
    
    Focus on the most important information and present it clearly and professionally.
    
    Document Text:
    ${cleanedText.slice(0, 15000)}${cleanedText.length > 15000 ? '...(content truncated for processing)' : ''}`

    const result = await model.generateContent(prompt)
    const aiSummary = result.response.text()

    console.log('POST /api/summarize - AI summary generated successfully')

    // Save processing result to database
    try {
      await prisma.pDFProcessing.create({
        data: {
          userId: user.id,
          fileName: file.name,
          fileSize: file.size,
          summary: aiSummary,
          metadata: {
            textLength: extractedText.length,
            parseMethod: parseMethod,
            processingTime: Date.now() - startTime,
            aiPowered: true
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

      console.log('POST /api/summarize - Processing result saved to database')
    } catch (dbError) {
      console.error('POST /api/summarize - Database save error:', dbError)
      // Continue even if database save fails
    }

    return NextResponse.json({
      summary: aiSummary,
      originalFileName: file.name,
      fileSize: file.size,
      textLength: extractedText.length,
      parseMethod: parseMethod,
      processedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      aiPowered: true
    })

  } catch (error) {
    console.error('POST /api/summarize - Error processing PDF:', error)
    
    // Provide specific error messages based on error type
    if (error instanceof Error) {
      console.error('POST /api/summarize - Error details:', error.message, error.stack)
      
      if (error.message.includes('API_KEY') || error.message.includes('genai')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily busy. Please try again in a few moments.' },
          { status: 429 }
        )
      }
      
      // For any other error, return a generic message but log the details
      return NextResponse.json(
        { error: `Processing failed: ${error.message}. Please ensure the file is a valid PDF and try again.` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process PDF. Please ensure the file is a valid PDF and try again.' },
      { status: 500 }
    )
  }
}
