import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Dynamic import for pdf-parse to avoid build issues
async function parsePDF(buffer: Buffer) {
  const pdf = await import('pdf-parse')
  return pdf.default(buffer)
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

    // Convert file to buffer for PDF parsing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF using dynamic import
    const pdfData = await parsePDF(buffer)
    const extractedText = pdfData.text

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Could not extract text from PDF. The file might be image-based or corrupted.' 
      }, { status: 400 })
    }

    // Generate AI summary using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `Please provide a comprehensive and professional summary of the following document text. 
    Structure your response with:
    
    📄 **Document Summary**
    
    **Key Highlights:** (3-4 main points)
    
    **Main Sections:** (Identify and list the primary sections/topics)
    
    **Critical Points:** (Important findings, conclusions, or recommendations)
    
    **Actionable Insights:** (What can be done based on this document)
    
    Keep the summary concise but informative, focusing on the most important information. Use bullet points and clear formatting.
    
    Document Text:
    ${extractedText.slice(0, 10000)} ${extractedText.length > 10000 ? '...(content truncated for processing)' : ''}`

    const result = await model.generateContent(prompt)
    const aiSummary = result.response.text()

    return NextResponse.json({
      summary: aiSummary,
      originalFileName: file.name,
      fileSize: file.size,
      textLength: extractedText.length,
      processedAt: new Date().toISOString(),
      aiPowered: true
    })

  } catch (error) {
    console.error('Error processing PDF:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      if (error.message.includes('pdf')) {
        return NextResponse.json(
          { error: 'Failed to parse PDF. Please ensure the file is not corrupted.' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    )
  }
}
