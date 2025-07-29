import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AnalyticsData {
  totalSummaries: number
  weeklyUsage: Array<{ day: string; count: number; date: string }>
  monthlyUsage: Array<{ month: string; summaries: number; timesSaved: number; date: string }>
  topCategories: Array<{ category: string; count: number; percentage: number; color: string }>
  averageProcessingTime: number
  accuracyScore: number
  totalTimeSaved: number
  userGrowth: number
  activeUsers: number
  conversionRate: number
  retentionRate: number
  popularFeatures: Array<{ feature: string; usage: number; trend: 'up' | 'down' | 'stable' }>
  geographicData: Array<{ country: string; users: number; percentage: number }>
  performanceMetrics: {
    successRate: number
    errorRate: number
    averageResponseTime: number
    peakUsageHour: number
  }
  recentActivity: Array<{
    id: string
    type: 'summary' | 'chat' | 'export' | 'share'
    user: string
    document: string
    timestamp: Date
    duration?: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin for global analytics
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

    // Get PDF processing data
    const pdfProcessings = await prisma.pDFProcessing.findMany({
      where: {
        ...baseFilter,
        processedAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    })

    // Get chat sessions data
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        ...baseFilter,
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        messages: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get payment data (admin only)
    const payments = isAdmin ? await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            subscription: true
          }
        }
      }
    }) : []

    // Calculate analytics
    const analytics = await calculateAnalytics({
      pdfProcessings,
      chatSessions,
      payments,
      range,
      startDate,
      endDate: now,
      isAdmin
    })

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

async function calculateAnalytics({
  pdfProcessings,
  chatSessions,
  payments,
  startDate,
  endDate,
  isAdmin
}: {
  pdfProcessings: Array<{
    id: string
    fileName: string
    processedAt: Date
    metadata?: any
    user?: { name?: string; email: string; createdAt: Date }
  }>
  chatSessions: Array<{
    id: string
    title: string
    createdAt: Date
    messages: any[]
    user?: { name?: string; email: string }
  }>
  payments: Array<{
    id: string
    createdAt: Date
    user?: { name?: string; email: string; subscription: string }
  }>
  startDate: Date
  endDate: Date
  isAdmin: boolean
}): Promise<AnalyticsData> {
  
  // Calculate basic metrics
  const totalSummaries = pdfProcessings.length
  const totalChatSessions = chatSessions.length
  const totalMessages = chatSessions.reduce((sum, session) => sum + session.messages.length, 0)

  // Calculate weekly usage
  const weeklyUsage = calculateWeeklyUsage(pdfProcessings, startDate, endDate)
  
  // Calculate monthly usage
  const monthlyUsage = calculateMonthlyUsage(pdfProcessings, startDate, endDate)

  // Analyze document categories (mock data for now)
  const topCategories = [
    { category: 'Research Papers', count: Math.floor(totalSummaries * 0.3), percentage: 30, color: 'bg-blue-600' },
    { category: 'Business Reports', count: Math.floor(totalSummaries * 0.25), percentage: 25, color: 'bg-green-600' },
    { category: 'Technical Documentation', count: Math.floor(totalSummaries * 0.2), percentage: 20, color: 'bg-purple-600' },
    { category: 'Legal Documents', count: Math.floor(totalSummaries * 0.15), percentage: 15, color: 'bg-orange-600' },
    { category: 'Other', count: Math.floor(totalSummaries * 0.1), percentage: 10, color: 'bg-gray-600' }
  ]

  // Calculate processing metrics
  const processingTimes = pdfProcessings
    .map(p => p.metadata?.result?.metadata?.processingTime)
    .filter(t => typeof t === 'number')
  
  const averageProcessingTime = processingTimes.length > 0 
    ? Math.round(processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length / 1000)
    : 3

  // Calculate time saved (estimate 2.5 minutes reading time per summary)
  const totalTimeSaved = totalSummaries * 2.5 / 60 // Convert to hours

  // Calculate user metrics (admin only)
  const activeUsers = isAdmin ? await calculateActiveUsers(startDate, endDate) : 1
  const userGrowth = isAdmin ? await calculateUserGrowth(startDate, endDate) : 0
  const conversionRate = isAdmin ? calculateConversionRate(payments) : 0
  const retentionRate = isAdmin ? await calculateRetentionRate(startDate, endDate) : 0

  // Popular features analysis
  const popularFeatures = [
    { feature: 'PDF Summarization', usage: totalSummaries, trend: 'up' as const },
    { feature: 'Chat with PDF', usage: totalChatSessions, trend: totalChatSessions > totalSummaries * 0.3 ? 'up' as const : 'stable' as const },
    { feature: 'Export Features', usage: Math.floor(totalSummaries * 0.4), trend: 'stable' as const },
    { feature: 'Multi-language', usage: Math.floor(totalSummaries * 0.2), trend: 'up' as const }
  ]

  // Geographic data (mock for now)
  const geographicData = [
    { country: 'India', users: Math.floor(activeUsers * 0.4), percentage: 40 },
    { country: 'United States', users: Math.floor(activeUsers * 0.25), percentage: 25 },
    { country: 'United Kingdom', users: Math.floor(activeUsers * 0.15), percentage: 15 },
    { country: 'Canada', users: Math.floor(activeUsers * 0.1), percentage: 10 },
    { country: 'Others', users: Math.floor(activeUsers * 0.1), percentage: 10 }
  ]

  // Performance metrics
  const performanceMetrics = {
    successRate: 98.5,
    errorRate: 1.5,
    averageResponseTime: averageProcessingTime * 1000,
    peakUsageHour: 14 // 2 PM
  }

  // Recent activity
  const recentActivity = [
    ...pdfProcessings.slice(0, 5).map(p => ({
      id: p.id,
      type: 'summary' as const,
      user: p.user?.name || 'Anonymous',
      document: p.fileName,
      timestamp: p.processedAt,
      duration: p.metadata?.result?.metadata?.processingTime ? Math.round(p.metadata.result.metadata.processingTime / 1000) : undefined
    })),
    ...chatSessions.slice(0, 5).map(s => ({
      id: s.id,
      type: 'chat' as const,
      user: s.user?.name || 'Anonymous', 
      document: s.title,
      timestamp: s.createdAt
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

  return {
    totalSummaries,
    weeklyUsage,
    monthlyUsage,
    topCategories,
    averageProcessingTime,
    accuracyScore: 94.2, // Mock accuracy score
    totalTimeSaved,
    userGrowth,
    activeUsers,
    conversionRate,
    retentionRate,
    popularFeatures,
    geographicData,
    performanceMetrics,
    recentActivity
  }
}

function calculateWeeklyUsage(pdfProcessings: any[], startDate: Date, endDate: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyData = Array(7).fill(0).map((_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return {
      day: days[date.getDay()],
      count: 0,
      date: date.toISOString()
    }
  })

  pdfProcessings.forEach(processing => {
    const dayIndex = Math.floor((new Date(processing.processedAt).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (dayIndex >= 0 && dayIndex < 7) {
      weeklyData[dayIndex].count++
    }
  })

  return weeklyData
}

function calculateMonthlyUsage(pdfProcessings: any[], startDate: Date, endDate: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyData: Array<{ month: string; summaries: number; timesSaved: number; date: string }> = []

  const current = new Date(startDate)
  while (current <= endDate) {
    const monthData = {
      month: months[current.getMonth()],
      summaries: 0,
      timesSaved: 0,
      date: current.toISOString()
    }

    pdfProcessings.forEach(processing => {
      const processingDate = new Date(processing.processedAt)
      if (processingDate.getMonth() === current.getMonth() && 
          processingDate.getFullYear() === current.getFullYear()) {
        monthData.summaries++
        monthData.timesSaved += 2.5 // Estimate 2.5 minutes saved per summary
      }
    })

    monthlyData.push(monthData)
    current.setMonth(current.getMonth() + 1)
  }

  return monthlyData
}

async function calculateActiveUsers(startDate: Date, endDate: Date): Promise<number> {
  const activeUsers = await prisma.user.count({
    where: {
      OR: [
        {
          pdfProcessing: {
            some: {
              processedAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        },
        {
          chatSessions: {
            some: {
              lastActivity: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      ]
    }
  })

  return activeUsers
}

async function calculateUserGrowth(startDate: Date, endDate: Date): Promise<number> {
  const currentPeriodUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  })

  const previousStartDate = new Date(startDate)
  previousStartDate.setTime(startDate.getTime() - (endDate.getTime() - startDate.getTime()))

  const previousPeriodUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: previousStartDate,
        lt: startDate
      }
    }
  })

  if (previousPeriodUsers === 0) return 100
  return Math.round(((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100)
}

function calculateConversionRate(payments: any[]): number {
  // Mock conversion rate calculation
  return payments.length > 0 ? 15.8 : 0
}

async function calculateRetentionRate(startDate: Date, endDate: Date): Promise<number> {
  // Mock retention rate calculation
  return 72.4
}
