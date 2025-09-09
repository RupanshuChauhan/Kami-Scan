// Environment variable validation and configuration
export const config = {
  // Authentication
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
  
  // AI Services
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Payment
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Feature flags
  ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === 'true',
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS === 'true',
}

export const validateEnvironment = () => {
  const errors: string[] = []
  
  // Critical environment variables that must be present
  const required = {
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    DATABASE_URL: config.DATABASE_URL,
  }
  
  // Optional but recommended
  const recommended = {
    GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET,
    GEMINI_API_KEY: config.GEMINI_API_KEY,
  }
  
  // Check required variables
  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`)
    }
  })
  
  // Warn about missing recommended variables
  Object.entries(recommended).forEach(([key, value]) => {
    if (!value) {
      console.warn(`Missing recommended environment variable: ${key}`)
    }
  })
  
  if (errors.length > 0) {
    console.error('Environment validation failed:', errors)
    if (config.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${errors.join(', ')}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config
  }
}

// Safe environment access with fallbacks
export const getConfig = () => {
  try {
    return validateEnvironment()
  } catch (error) {
    console.error('Environment validation error:', error)
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      config
    }
  }
}
