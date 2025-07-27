


'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Zap, Crown, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayPaymentProps {
  plan: string
  amount: number
  features: string[]
  popular?: boolean
}

export default function RazorpayPayment({ plan, amount, features, popular }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const getPlanIcon = () => {
    switch (plan) {
      case 'starter': return <Zap className="w-6 h-6" />
      case 'pro': return <Crown className="w-6 h-6" />
      case 'enterprise': return <Building2 className="w-6 h-6" />
      default: return <Zap className="w-6 h-6" />
    }
  }

  const getPlanName = () => {
    switch (plan) {
      case 'starter': return 'Starter'
      case 'pro': return 'Professional'
      case 'enterprise': return 'Enterprise'
      default: return 'Plan'
    }
  }

  const handlePayment = async () => {
    if (!session?.user) {
      toast.error('Please sign in to continue')
      return
    }

    setLoading(true)

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          amount
        })
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'KamiScan',
        description: `${getPlanName()} Plan Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: {
          color: '#8b5cf6'
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan
              })
            })

            if (verifyResponse.ok) {
              toast.success('🎉 Payment successful! Your subscription is now active.')
              // Refresh the page to update subscription status
              window.location.reload()
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
            console.error('Payment verification error:', error)
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed')
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const magicButtonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 ${
        popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-gray-700 hover:border-purple-500/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2 text-purple-400">
          {getPlanIcon()}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{getPlanName()}</h3>
        <div className="text-center">
          <span className="text-4xl font-bold text-white">₹{amount}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
          popular
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        variants={magicButtonVariants}
        whileHover={loading ? {} : "hover"}
        whileTap={loading ? {} : "tap"}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Processing...</span>
          </div>
        ) : (
          `Choose ${getPlanName()}`
        )}
      </motion.button>
    </motion.div>
  )
}
