'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Clock } from 'lucide-react'
import Header from '../../components/Header'

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FileText className="w-6 h-6" />,
      content: [
        "By accessing and using KamiScan (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service.",
        "We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the new terms."
      ]
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "KamiScan provides AI-powered PDF document summarization services through our web platform and API.",
        "The service uses machine learning algorithms to analyze and generate summaries of uploaded PDF documents.",
        "We offer various subscription tiers with different usage limits and features.",
        "Admin users (specifically vaivhavchauhan2162003@gmail.com) receive unlimited free access to all features.",
        "The service is provided &quot;as is&quot; and we make no warranties regarding availability, accuracy, or performance."
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "You must create an account to use certain features of our service.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must provide accurate and complete information during registration.",
        "You are responsible for all activities that occur under your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
        "Users must complete our security form after initial login for compliance purposes."
      ]
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: <Scale className="w-6 h-6" />,
      content: [
        "You may only upload documents that you own or have permission to process.",
        "You must not upload documents containing illegal, harmful, or offensive content.",
        "You must not attempt to reverse engineer, modify, or compromise our service.",
        "You must not use the service for any commercial purpose without proper authorization.",
        "You must not share your account credentials or allow unauthorized access.",
        "You must comply with all applicable laws and regulations when using our service.",
        "Violation of this policy may result in immediate account termination."
      ]
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Handling",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for detailed information.",
        "We collect only the minimum data necessary to provide our services.",
        "Original PDF files are processed temporarily and deleted immediately after summarization.",
        "Generated summaries are stored according to your subscription plan and preferences.",
        "We implement industry-standard security measures to protect your data.",
        "We do not sell or share your personal information with third parties except as described in our Privacy Policy."
      ]
    },
    {
      id: "payment-billing",
      title: "Payment and Billing",
      icon: <CreditCard className="w-6 h-6" />,
      content: [
        "Paid plans are billed monthly or annually as selected during subscription.",
        "All fees are non-refundable except as required by law or our refund policy.",
        "We offer a 30-day money-back guarantee for new subscribers.",
        "Price changes will be communicated at least 30 days in advance.",
        "Failure to pay may result in service suspension or account termination.",
        "You are responsible for all taxes associated with your use of the service.",
        "Subscription auto-renewal can be disabled in your account settings."
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <FileText className="w-6 h-6" />,
      content: [
        "KamiScan and all related trademarks, logos, and content are our intellectual property.",
        "You retain ownership of documents you upload, but grant us limited rights to process them.",
        "Generated summaries are your intellectual property, subject to our terms of use.",
        "You may not copy, modify, or distribute our software or content without permission.",
        "Any feedback or suggestions you provide may be used to improve our service.",
        "Third-party content and services are subject to their respective terms and licenses."
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        "The service is provided &quot;as is&quot; without warranties of any kind.",
        "We do not guarantee the accuracy, completeness, or usefulness of generated summaries.",
        "You use the service at your own risk and discretion.",
        "We are not liable for any damages arising from your use of the service.",
        "Our total liability is limited to the amount you paid for the service in the past 12 months.",
        "Some jurisdictions do not allow limitation of liability, so these limits may not apply to you."
      ]
    },
    {
      id: "termination",
      title: "Termination",
      icon: <Clock className="w-6 h-6" />,
      content: [
        "You may terminate your account at any time through your account settings.",
        "We may terminate or suspend your account for violation of these terms.",
        "Upon termination, your access to the service will cease immediately.",
        "We may retain certain information as required by law or for legitimate business purposes.",
        "Paid subscriptions will be honored until the end of the current billing period.",
        "These terms will survive termination where applicable."
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              These terms govern your use of KamiScan. Please read them carefully before using our service.
            </p>
            <div className="inline-flex items-center bg-blue-500/20 text-blue-400 px-6 py-3 rounded-full text-sm font-medium">
              <Scale className="w-4 h-4 mr-2" />
              Effective Date: January 27, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileText className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Terms Summary</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              By using KamiScan, you agree to our terms of service. You&apos;re responsible for your content, 
              we&apos;re responsible for providing a secure and reliable service. Let&apos;s build great things together!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-2">✓</div>
                <div className="text-purple-200 text-sm">Use responsibly</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">🔒</div>
                <div className="text-purple-200 text-sm">Your data is protected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-2">🚀</div>
                <div className="text-purple-200 text-sm">We&apos;re here to help</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section, index) => (
                <motion.a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-purple-400">{section.icon}</div>
                  <span className="text-gray-300 hover:text-white transition-colors">
                    {section.title}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.content.map((paragraph, paragraphIndex) => (
                    <motion.div
                      key={paragraphIndex}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: paragraphIndex * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{paragraph}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Legal Questions */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Scale className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please contact our legal team. 
              We&apos;re here to help clarify any concerns you may have.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Legal Contact</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Email: legal@kamiscan.com</p>
                  <p>Address: 123 Innovation Drive</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Response Time</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Legal inquiries: 5-7 business days</p>
                  <p>Urgent matters: 24-48 hours</p>
                  <p>Business hours: Mon-Fri, 9 AM - 6 PM PST</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AlertTriangle className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Changes to These Terms</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We may update these Terms of Service from time to time. We will notify users of any 
              material changes at least 30 days before they take effect.
            </p>
            <div className="bg-white/10 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-100 text-sm">
                <strong>Your continued use of KamiScan after changes take effect constitutes 
                acceptance of the new terms.</strong> If you disagree with changes, you may 
                terminate your account before they take effect.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
