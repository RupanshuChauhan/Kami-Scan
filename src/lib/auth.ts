import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
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
    async redirect({ url, baseUrl }) {
      // Redirect to main page after successful login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default redirect to main page
      return baseUrl
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
})

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
}
