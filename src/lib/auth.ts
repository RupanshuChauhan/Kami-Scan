import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Add user ID and additional properties to session
        session.user.id = user.id
        
        // Get user from database to include our custom fields
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            isAdmin: true,
            securityFormCompleted: true,
            subscription: true,
            usageCount: true,
            usageLimit: true
          }
        })
        
        if (dbUser) {
          session.user.isAdmin = dbUser.isAdmin
          session.user.securityFormCompleted = dbUser.securityFormCompleted
          session.user.subscription = dbUser.subscription
          session.user.usageCount = dbUser.usageCount
          session.user.usageLimit = dbUser.usageLimit
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Set admin status for the specified email
        const isAdmin = user.email === process.env.ADMIN_EMAIL
        
        // Update or create user with admin status
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            isAdmin,
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            isAdmin,
          }
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
