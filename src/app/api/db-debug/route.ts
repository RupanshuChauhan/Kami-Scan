import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isAdmin: true,
        accounts: {
          select: {
            provider: true,
            type: true,
            providerAccountId: true
          }
        }
      }
    })

    const accounts = await prisma.account.findMany({
      select: {
        provider: true,
        type: true,
        providerAccountId: true,
        userId: true,
      }
    })

    return NextResponse.json({
      users,
      accounts,
      userCount: users.length,
      accountCount: accounts.length
    })
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json({ error: 'Database error', details: error }, { status: 500 })
  }
}
