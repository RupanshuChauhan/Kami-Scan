import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const isAdmin = session.user.email === process.env.ADMIN_EMAIL
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || 'month'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Base filter for user-specific or global data
    const baseFilter = isAdmin ? {} : { userId: session.user.id }

    // Get basic counts
    const totalSummaries = await prisma.pDFProcessing.count({
      where: {
        ...baseFilter,
        processedAt: {
          gte: startDate,
          lte: now
        }
      }
    })

    const totalChatSessions = await prisma.chatSession.count({
      where: {
        ...baseFilter,
        createdAt: {
          gte: startDate,
          lte: now
        }
      }
    })

    // Mock data for demo purposes
    const analytics = {
      totalSummaries,
      weeklyUsage: generateWeeklyUsage(totalSummaries),
      monthlyUsage: generateMonthlyUsage(totalSummaries),
      topCategories: [
        { category: 'Research Papers', count: Math.floor(totalSummaries * 0.3), percentage: 30, color: 'bg-blue-600' },
        { category: 'Business Reports', count: Math.floor(totalSummaries * 0.25), percentage: 25, color: 'bg-green-600' },
        { category: 'Technical Documentation', count: Math.floor(totalSummaries * 0.2), percentage: 20, color: 'bg-purple-600' },
        { category: 'Legal Documents', count: Math.floor(totalSummaries * 0.15), percentage: 15, color: 'bg-orange-600' },
        { category: 'Other', count: Math.floor(totalSummaries * 0.1), percentage: 10, color: 'bg-gray-600' }
      ],
      averageProcessingTime: 3,
      accuracyScore: 94.2,
      totalTimeSaved: Math.round(totalSummaries * 2.5 / 60 * 100) / 100,
      userGrowth: 23,
      activeUsers: isAdmin ? 127 : 1,
      conversionRate: 15.8,
      retentionRate: 72.4,
      popularFeatures: [
        { feature: 'PDF Summarization', usage: totalSummaries, trend: 'up' as const },
        { feature: 'Chat with PDF', usage: totalChatSessions, trend: 'up' as const },
        { feature: 'Export Features', usage: Math.floor(totalSummaries * 0.4), trend: 'stable' as const },
        { feature: 'Multi-language', usage: Math.floor(totalSummaries * 0.2), trend: 'up' as const }
      ],
      geographicData: [
        { country: 'India', users: isAdmin ? 51 : 1, percentage: 40 },
        { country: 'United States', users: isAdmin ? 32 : 0, percentage: 25 },
        { country: 'United Kingdom', users: isAdmin ? 19 : 0, percentage: 15 },
        { country: 'Canada', users: isAdmin ? 13 : 0, percentage: 10 },
        { country: 'Others', users: isAdmin ? 12 : 0, percentage: 10 }
      ],
      performanceMetrics: {
        successRate: 98.5,
        errorRate: 1.5,
        averageResponseTime: 3000,
        peakUsageHour: 14
      },
      recentActivity: await getRecentActivity(baseFilter, 10)
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

function generateWeeklyUsage(totalSummaries: number) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, index) => ({
    day,
    count: Math.floor(Math.random() * (totalSummaries / 3)) + 1,
    date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toISOString()
  }))
}

function generateMonthlyUsage(totalSummaries: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month, index) => ({
    month,
    summaries: Math.floor(totalSummaries / months.length) + Math.floor(Math.random() * 10),
    timesSaved: Math.floor(totalSummaries * 2.5 / months.length),
    date: new Date(Date.now() - (5 - index) * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

async function getRecentActivity(baseFilter: Record<string, unknown>, limit: number) {
  try {
    const recentPdfProcessings = await prisma.pDFProcessing.findMany({
      where: baseFilter,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { processedAt: 'desc' },
      take: limit
    })

    const recentChatSessions = await prisma.chatSession.findMany({
      where: baseFilter,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const activities = [
      ...recentPdfProcessings.map(p => ({
        id: p.id,
        type: 'summary' as const,
        user: p.user?.name || 'Anonymous User',
        document: p.fileName,
        timestamp: p.processedAt
      })),
      ...recentChatSessions.map(s => ({
        id: s.id,
        type: 'chat' as const,
        user: s.user?.name || 'Anonymous User',
        document: s.title,
        timestamp: s.createdAt
      }))
    ]

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}
