import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.json()
    
    // Validate required fields
    const requiredFields = ['fullName', 'phoneNumber', 'address', 'purposeOfUse', 'agreedToTerms', 'agreedToPrivacy']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // If business/education/research, organization name is required
    if (['business', 'education', 'research'].includes(formData.purposeOfUse) && !formData.organizationName) {
      return NextResponse.json({ error: 'Organization name is required for this purpose of use' }, { status: 400 })
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        securityFormCompleted: true,
        name: session.user.name,
        image: session.user.image,
        // Set admin status for the specified email
        isAdmin: session.user.email === process.env.ADMIN_EMAIL
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        securityFormCompleted: true,
        // Set admin status for the specified email
        isAdmin: session.user.email === process.env.ADMIN_EMAIL
      }
    })

    // Create or update security form
    await prisma.securityForm.upsert({
      where: { userId: user.id },
      update: {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        purposeOfUse: formData.purposeOfUse,
        organizationName: formData.organizationName || null,
        agreedToTerms: formData.agreedToTerms,
        agreedToPrivacy: formData.agreedToPrivacy,
        submittedAt: new Date()
      },
      create: {
        userId: user.id,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        purposeOfUse: formData.purposeOfUse,
        organizationName: formData.organizationName || null,
        agreedToTerms: formData.agreedToTerms,
        agreedToPrivacy: formData.agreedToPrivacy
      }
    })

    return NextResponse.json({ success: true, message: 'Security form submitted successfully' })
  } catch (error) {
    console.error('Security form submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
