import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { summaryId, title, content } = body

    // Simulate saving to library
    await new Promise(resolve => setTimeout(resolve, 500))

    const savedItem = {
      id: `lib_${Date.now()}`,
      title,
      content,
      savedAt: new Date().toISOString(),
      tags: ['summary', 'saved']
    }

    console.log(`Saved to library: ${summaryId}`)

    return NextResponse.json({
      success: true,
      item: savedItem
    })
  } catch (error) {
    console.error('Library save error:', error)
    return NextResponse.json(
      { error: 'Failed to save to library' },
      { status: 500 }
    )
  }
}
