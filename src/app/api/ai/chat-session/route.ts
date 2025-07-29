import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { pdfId, pdfTitle } = await request.json()

    if (!pdfId || !pdfTitle) {
      return NextResponse.json(
        { error: 'PDF ID and title are required' },
        { status: 400 }
      )
    }

    // Check if chat session already exists for this PDF and user
    let chatSession = await prisma.chatSession.findFirst({
      where: {
        userId: session.user.id,
        pdfId: pdfId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50 // Limit to last 50 messages
        }
      }
    })

    // Create new session if none exists
    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          pdfId: pdfId,
          title: `Chat: ${pdfTitle}`,
          metadata: {
            pdfTitle,
            createdFrom: 'web'
          }
        },
        include: {
          messages: true
        }
      })
    } else {
      // Update last activity
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { lastActivity: new Date() }
      })
    }

    return NextResponse.json({
      session: {
        id: chatSession.id,
        pdfId: chatSession.pdfId,
        title: chatSession.title,
        createdAt: chatSession.createdAt,
        messageCount: chatSession.messages.length,
        lastActivity: chatSession.lastActivity
      },
      messages: chatSession.messages.map(msg => {
        const metadata = msg.metadata as Record<string, unknown> | null
        return {
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
          citations: (metadata?.citations as Array<{ page: number; text: string; relevance: number }>) || [],
          metadata: (metadata?.processingData as Record<string, unknown>) || {},
          reactions: (metadata?.reactions as Record<string, boolean>) || {},
          suggestions: (metadata?.suggestions as string[]) || []
        }
      })
    })

  } catch (error) {
    console.error('Chat session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    )
  }
}
