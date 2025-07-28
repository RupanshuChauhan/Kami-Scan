import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Razorpay from 'razorpay'

const prisma = new PrismaClient()

// Initialize Razorpay only if credentials are available
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { plan, amount } = await request.json()

    // Validate plan
    const validPlans = ['starter', 'pro', 'enterprise']
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: `kamiscan_${plan}_${Date.now()}`,
      notes: {
        userId: session.user.id,
        plan: plan,
        email: session.user.email
      }
    })

    // Save payment record to database
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        plan: plan,
        razorpayOrderId: order.id,
        metadata: {
          orderId: order.id,
          receipt: order.receipt
        }
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
