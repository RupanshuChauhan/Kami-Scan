'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import SecurityForm from './SecurityForm'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession()
  const [showSecurityForm, setShowSecurityForm] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and needs to complete security form
    if (status === 'authenticated' && session?.user) {
      // Check if user has completed security form
      const hasCompletedSecurityForm = session.user.securityFormCompleted
      
      if (!hasCompletedSecurityForm) {
        setShowSecurityForm(true)
      }
    }
  }, [session, status])

  const handleSecurityFormComplete = () => {
    setShowSecurityForm(false)
    // Refresh the session to get updated user data
    window.location.reload()
  }

  return (
    <>
      {children}
      {showSecurityForm && (
        <SecurityForm onComplete={handleSecurityFormComplete} />
      )}
    </>
  )
}
