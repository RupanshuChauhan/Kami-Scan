import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isAdmin: boolean
      securityFormCompleted: boolean
      subscription: string
      usageCount: number
      usageLimit: number
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    isAdmin: boolean
    securityFormCompleted: boolean
    subscription: string
    usageCount: number
    usageLimit: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    isAdmin: boolean
    securityFormCompleted: boolean
    subscription: string
    usageCount: number
    usageLimit: number
  }
}
