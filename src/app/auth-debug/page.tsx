import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function AuthDebugPage() {
  const session = await auth()
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication Debug Page</h1>
      
      <h2>Environment Variables Status:</h2>
      <ul>
        <li>NODE_ENV: {process.env.NODE_ENV}</li>
        <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'NOT SET'}</li>
        <li>AUTH_SECRET: {process.env.AUTH_SECRET ? '✅ SET' : '❌ NOT SET'}</li>
        <li>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ NOT SET'}</li>
        <li>GOOGLE_CLIENT_SECRET: {process.env.GOOGLE_CLIENT_SECRET ? '✅ SET' : '❌ NOT SET'}</li>
      </ul>
      
      <h2>Current Session:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      
      <h2>Required Google OAuth Settings:</h2>
      <p>Make sure these URLs are added as authorized redirect URIs in your Google Cloud Console:</p>
      <ul>
        <li>http://localhost:3000/api/auth/callback/google</li>
        <li>https://kami-scan.vercel.app/api/auth/callback/google</li>
      </ul>
      
      <h2>Authentication URLs:</h2>
      <ul>
        <li><a href="/api/auth/signin" target="_blank" rel="noopener noreferrer">Sign In</a></li>
        <li><a href="/api/auth/signout" target="_blank" rel="noopener noreferrer">Sign Out</a></li>
        <li><a href="/api/auth/session" target="_blank" rel="noopener noreferrer">Session API</a></li>
        <li><a href="/api/auth/providers" target="_blank" rel="noopener noreferrer">Providers API</a></li>
      </ul>
      
      <Link href="/" style={{ 
        display: 'inline-block', 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px' 
      }}>
        Back to Home
      </Link>
    </div>
  )
}
