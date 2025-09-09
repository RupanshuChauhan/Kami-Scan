import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('GET /api/user/stats - Request received')
    
    const session = await auth()
    console.log('Session:', session?.user?.email || 'No session')
    
    if (!session?.user?.email) {
      console.log('No authenticated user')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      // Get user data from database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          usageCount: true,
          usageLimit: true,
          subscription: true,
          isAdmin: true
        }
      })
      
      // Get count of processed documents separately
      const documentCount = await prisma.pDFProcessing.count({
        where: { userId: user?.id || '' }
      })

      if (!user) {
        console.log('User not found in database')
        // Return default stats for new users
        return NextResponse.json({
          totalProcessed: 0,
          timesSaved: 0,
          accuracyRate: 95
        })
      }

      // Calculate stats
      const totalProcessed = documentCount
      const timesSaved = Math.floor(totalProcessed * 2.5) // Estimate 2.5 hours saved per document
      const accuracyRate = 95 // Default high accuracy rate

      const stats = {
        totalProcessed,
        timesSaved,
        accuracyRate,
        usageCount: user.usageCount,
        usageLimit: user.usageLimit,
        subscription: user.subscription,
        isAdmin: user.isAdmin
      }

      console.log('Stats generated:', stats)
      return NextResponse.json(stats)
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return fallback stats if database fails
      return NextResponse.json({
        totalProcessed: 0,
        timesSaved: 0,
        accuracyRate: 95
      })
    }

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
