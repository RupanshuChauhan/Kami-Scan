import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/config'

export async function GET() {
  try {
    console.log('Checking environment configuration...')
    
    const configResult = getConfig()
    
    const envCheck = {
      isValid: configResult.isValid,
      errors: configResult.errors,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      checks: {
        NEXTAUTH_SECRET: !!configResult.config.NEXTAUTH_SECRET,
        NEXTAUTH_URL: !!configResult.config.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: !!configResult.config.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: !!configResult.config.GOOGLE_CLIENT_SECRET,
        GEMINI_API_KEY: !!configResult.config.GEMINI_API_KEY,
        DATABASE_URL: !!configResult.config.DATABASE_URL,
        RAZORPAY_KEY_ID: !!configResult.config.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: !!configResult.config.RAZORPAY_KEY_SECRET,
      }
    }
    
    console.log('Environment check result:', envCheck)
    
    return NextResponse.json(envCheck)
    
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Environment check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
