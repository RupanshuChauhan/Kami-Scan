'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Brain, Cloud, FileText, Sparkles, CheckCircle, Users, Globe, Lock } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Zero Latency Processing",
      description: "Experience instant PDF summarization with our optimized AI pipeline. No waiting, just results.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Technology",
      description: "Powered by Google Gemini AI for intelligent, context-aware document analysis and summarization.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security measures protect your sensitive documents at every step.",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud-Native Architecture",
      description: "Built on modern cloud infrastructure for maximum reliability and scalability.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Multi-Format Support",
      description: "Support for various PDF types including scanned documents, forms, and complex layouts.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Magic User Experience",
      description: "Smooth animations and intuitive interface with instant touch effects for delightful interactions.",
      color: "from-pink-500 to-red-500"
    }
  ]

  const benefits = [
    "Save 90% of your document reading time",
    "Extract key insights from lengthy reports instantly",
    "Maintain document context and accuracy",
    "Access from anywhere with cloud sync",
    "Professional-grade security and compliance",
    "Unlimited usage for admin users"
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
              Powerful Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Discover how KamiScan revolutionizes document processing with cutting-edge AI technology 
              and user-focused design principles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">
                Why Choose KamiScan?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/400/300')] opacity-10"></div>
                <div className="relative z-10">
                  <Users className="w-16 h-16 text-white mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Trusted by Professionals
                  </h3>
                  <p className="text-purple-100 mb-6">
                    Join thousands of users who have transformed their document workflow with KamiScan.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">10K+</div>
                      <div className="text-purple-200 text-sm">Documents Processed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">99.9%</div>
                      <div className="text-purple-200 text-sm">Accuracy Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-purple-200 text-sm">Availability</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Technical Excellence</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies and best practices for optimal performance and reliability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="w-6 h-6" />, title: "Global CDN", desc: "Worldwide availability" },
              { icon: <Lock className="w-6 h-6" />, title: "SOC 2 Compliant", desc: "Enterprise security" },
              { icon: <Zap className="w-6 h-6" />, title: "Sub-second Response", desc: "Lightning fast processing" },
              { icon: <Shield className="w-6 h-6" />, title: "99.99% Uptime", desc: "Always available" }
            ].map((spec, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-purple-500/20 rounded-lg p-3 w-fit mx-auto mb-4">
                  {spec.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{spec.title}</h3>
                <p className="text-gray-400 text-sm">{spec.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
