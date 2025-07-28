import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Please upload a PDF smaller than 10MB.' 
      }, { status: 400 })
    }

    // Convert file to buffer for PDF parsing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let extractedText = ''
    let parseMethod = 'unknown'

    // Try primary PDF parsing method
    try {
      const pdfData = await parsePDF(buffer)
      extractedText = pdfData.text
      parseMethod = 'pdf-parse'
    } catch (primaryError) {
      console.log('Primary PDF parsing failed, trying fallback method...', primaryError)
      
      // Try fallback text extraction
      try {
        extractedText = extractTextFallback(buffer)
        parseMethod = 'fallback'
      } catch (fallbackError) {
        console.log('Fallback parsing also failed:', fallbackError)
        
        // Final fallback: Generate a demo summary based on filename if all parsing fails
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
      return NextResponse.json({ 
        error: 'The PDF appears to contain very little text or may be image-based. Please ensure your PDF contains readable text content.' 
      }, { status: 400 })
    }

    // Clean and prepare text for AI processing
    const cleanedText = extractedText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?;:()\-"']/g, '') // Remove special characters
      .trim()

    // Generate AI summary using Gemini
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

    return NextResponse.json({
      summary: aiSummary,
      originalFileName: file.name,
      fileSize: file.size,
      textLength: extractedText.length,
      parseMethod: parseMethod,
      processedAt: new Date().toISOString(),
      aiPowered: true
    })

  } catch (error) {
    console.error('Error processing PDF:', error)
    
    // Provide specific error messages based on error type
    if (error instanceof Error) {
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
    }
    
    return NextResponse.json(
      { error: 'Failed to process PDF. Please ensure the file is a valid PDF and try again.' },
      { status: 500 }
    )
  }
}
