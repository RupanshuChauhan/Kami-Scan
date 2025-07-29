import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock data - replace with actual database queries
    const stats = {
      totalProcessed: Math.floor(Math.random() * 150) + 50,
      timesSaved: Math.floor(Math.random() * 100) + 20,
      accuracyRate: Math.floor(Math.random() * 10) + 90
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
