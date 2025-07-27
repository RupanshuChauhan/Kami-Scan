'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, FileText, Building, Phone, MapPin, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface SecurityFormProps {
  onComplete: () => void
}

export default function SecurityForm({ onComplete }: SecurityFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    purposeOfUse: 'personal',
    organizationName: '',
    agreedToTerms: false,
    agreedToPrivacy: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
      toast.error('Please agree to our terms and privacy policy')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/security-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('✅ Security form completed successfully!')
        onComplete()
      } else {
        throw new Error('Failed to submit form')
      }
    } catch {
      toast.error('❌ Failed to submit security form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            KamiScan Security Form
          </h2>
          <p className="text-gray-400">
            Help us maintain KamiScan&apos;s security and compliance by completing this required form
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Full Legal Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="Enter your full legal name"
            />
          </motion.div>

          {/* Phone Number */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="Enter your full address"
            />
          </motion.div>

          {/* Purpose of Use */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Purpose of Use *
            </label>
            <select
              name="purposeOfUse"
              value={formData.purposeOfUse}
              onChange={handleInputChange}
              required
              title="Select your purpose of use"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            >
              <option value="personal">Personal Use</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="research">Research</option>
            </select>
          </motion.div>

          {/* Organization Name (conditional) */}
          {(formData.purposeOfUse === 'business' || formData.purposeOfUse === 'education' || formData.purposeOfUse === 'research') && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Organization Name *
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter your organization name"
              />
            </motion.div>
          )}

          {/* Agreements */}
          <motion.div
            className="space-y-4 pt-4 border-t border-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                I agree to KamiScan&apos;s{' '}
                <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </a>{' '}
                and understand that this information is required for security and compliance purposes.
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreedToPrivacy"
                checked={formData.agreedToPrivacy}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                I agree to KamiScan&apos;s{' '}
                <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </a>{' '}
                and consent to the collection and processing of my data as described.
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !formData.agreedToTerms || !formData.agreedToPrivacy}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Complete Security Form</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <motion.div
          className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-purple-300 mb-1">Security Notice</h4>
              <p className="text-xs text-gray-400">
                This information is collected to maintain KamiScan&apos;s security standards and legal compliance. 
                All data is encrypted and handled according to our privacy policy.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
