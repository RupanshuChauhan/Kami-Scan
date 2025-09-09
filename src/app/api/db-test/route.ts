import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test simple query
    const userCount = await prisma.user.count()
    console.log(`Found ${userCount} users in database`)
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: userCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
