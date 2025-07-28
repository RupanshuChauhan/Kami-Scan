import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    nextauthUrl: process.env.NEXTAUTH_URL,
    authSecret: process.env.AUTH_SECRET ? 'SET' : 'NOT_SET',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
  })
}
