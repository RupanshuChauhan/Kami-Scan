import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await request.json()

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Update payment record
    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        completedAt: new Date()
      }
    })

    // Update user subscription
    const subscriptionLimits = {
      starter: { usageLimit: 50, subscription: 'starter' },
      pro: { usageLimit: 500, subscription: 'pro' },
      enterprise: { usageLimit: -1, subscription: 'enterprise' } // -1 means unlimited
    }

    const limits = subscriptionLimits[plan as keyof typeof subscriptionLimits]

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscription: limits.subscription,
        usageLimit: limits.usageLimit,
        usageCount: 0 // Reset usage count on new subscription
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription updated successfully'
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
