'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Mail, Calendar } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PrivacyPage() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Database className="w-6 h-6" />,
      content: [
        "Personal Information: When you create an account, we collect your name, email address, and profile information from your Google account.",
        "Security Form Data: We collect additional information through our security form including your full name, phone number, address, purpose of use, and organization details if applicable.",
        "Document Data: We process the PDFs you upload temporarily to provide summarization services. We do not store the original documents after processing.",
        "Usage Data: We collect information about how you use our service, including features accessed, processing times, and error logs.",
        "Technical Data: We automatically collect IP addresses, browser information, device details, and other technical information for security and optimization purposes."
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <Eye className="w-6 h-6" />,
      content: [
        "Service Provision: To provide, maintain, and improve our PDF summarization services.",
        "Account Management: To create and manage your user account and provide customer support.",
        "Security & Compliance: To maintain security standards, prevent fraud, and ensure compliance with legal requirements.",
        "Communication: To send you service-related notifications, updates, and respond to your inquiries.",
        "Analytics: To analyze usage patterns and improve our service performance and features.",
        "Legal Compliance: To comply with applicable laws, regulations, and legal processes."
      ]
    },
    {
      id: "data-sharing",
      title: "Data Sharing and Disclosure",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "Service Providers: We may share data with trusted third-party service providers who assist in operating our service, such as cloud hosting providers and payment processors.",
        "Legal Requirements: We may disclose information when required by law, court order, or government request.",
        "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
        "Consent: We may share information with your explicit consent for specific purposes.",
        "Security: We may disclose information to protect our rights, property, or safety, or that of our users or others."
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "Encryption: All data is encrypted in transit using TLS/SSL and at rest using industry-standard encryption algorithms.",
        "Access Controls: We implement strict access controls and authentication measures to protect your data.",
        "Regular Audits: Our security practices undergo regular audits and assessments by third-party security firms.",
        "Data Minimization: We collect and retain only the minimum amount of data necessary to provide our services.",
        "Secure Infrastructure: Our systems are hosted on secure cloud infrastructure with enterprise-grade security measures.",
        "Employee Training: All employees receive regular security training and are bound by confidentiality agreements."
      ]
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Calendar className="w-6 h-6" />,
      content: [
        "Account Data: We retain your account information for as long as your account is active or as needed to provide services.",
        "PDF Processing: Original PDF files are deleted immediately after processing and generating summaries.",
        "Summaries: Generated summaries are retained according to your subscription plan and user preferences.",
        "Security Form Data: Security form information is retained for compliance and security purposes for a minimum of 7 years.",
        "Usage Logs: Technical logs and usage data are retained for up to 2 years for security and optimization purposes.",
        "Legal Requirements: Some data may be retained longer if required by law or for legal proceedings."
      ]
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Shield className="w-6 h-6" />,
      content: [
        "Access: You have the right to access and receive a copy of your personal data.",
        "Correction: You can request correction of inaccurate or incomplete personal data.",
        "Deletion: You can request deletion of your personal data, subject to certain legal and operational limitations.",
        "Portability: You have the right to receive your data in a portable format and transfer it to another service.",
        "Objection: You can object to certain processing of your personal data.",
        "Withdrawal: You can withdraw consent for data processing where consent is the legal basis.",
        "Complaints: You have the right to lodge a complaint with relevant data protection authorities."
      ]
    }
  ]

  const contactInfo = {
    email: "privacy@kamiscan.com",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    dpo: "Data Protection Officer"
  }

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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your privacy is important to us. This policy explains how we collect, use, 
              and protect your information when you use KamiScan.
            </p>
            <div className="inline-flex items-center bg-green-500/20 text-green-400 px-6 py-3 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Last updated: January 27, 2025
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

      {/* Privacy Policy Sections */}
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

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Contact Us About Privacy</h2>
              <p className="text-gray-300">
                If you have questions about this Privacy Policy or how we handle your data, please contact us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-purple-500/20 rounded-lg p-4 w-fit mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-300">{contactInfo.email}</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-blue-500/20 rounded-lg p-4 w-fit mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Protection Officer</h3>
                <p className="text-gray-300">{contactInfo.dpo}</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-green-500/20 rounded-lg p-4 w-fit mx-auto mb-4">
                  <Database className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Mailing Address</h3>
                <p className="text-gray-300 text-sm">{contactInfo.address}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Updates */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Calendar className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Policy Updates</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p className="text-purple-200 text-sm">
              We encourage you to review this Privacy Policy periodically to stay informed about 
              how we protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
