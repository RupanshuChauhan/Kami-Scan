'use client'

import { motion } from 'framer-motion'
import { Check, Star, Zap, ArrowRight } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import RazorpayPayment from '../../components/RazorpayPayment'

export default function PricingPage() {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started with PDF summarization",
      features: [
        "5 PDF summaries per month",
        "Up to 10MB file size",
        "Basic AI processing",
        "Standard support",
        "Web access only"
      ],
      buttonText: "Get Started Free",
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      id: "starter",
      name: "Starter",
      price: 299,
      period: "per month",
      description: "Great for individuals and small teams",
      features: [
        "50 PDF summaries per month",
        "Up to 50MB file size",
        "Advanced AI processing",
        "Priority support",
        "Export to multiple formats",
        "Basic analytics"
      ],
      buttonText: "Choose Starter",
      popular: false,
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: "pro",
      name: "Professional",
      price: 899,
      period: "per month",
      description: "Advanced features for professionals and businesses",
      features: [
        "500 PDF summaries per month",
        "Up to 100MB file size",
        "Premium AI processing",
        "Priority support",
        "API access",
        "Custom templates",
        "Export to multiple formats",
        "Team collaboration tools",
        "Advanced analytics",
        "Webhook integration"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      color: "from-purple-600 to-blue-600"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 2499,
      period: "per month",
      description: "Complete solution for large organizations",
      features: [
        "Everything in Pro",
        "Unlimited file size",
        "Custom AI model training",
        "24/7 dedicated support",
        "Advanced security controls",
        "SSO integration",
        "Custom branding",
        "SLA guarantees",
        "On-premise deployment option"
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const faqs = [
    {
      question: "How does the free plan work?",
      answer: "The free plan gives you 5 PDF summaries per month with basic AI processing. It's perfect for trying out KamiScan's capabilities."
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle."
    },
    {
      question: "What happens if I exceed my monthly limit?",
      answer: "On the free plan, you'll need to wait until the next month or upgrade to continue using the service. Pro and Enterprise plans have unlimited usage."
    },
    {
      question: "Is there a discount for annual billing?",
      answer: "Yes! Annual billing gives you 2 months free (20% discount) on both Pro and Enterprise plans."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund."
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
              Simple Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your PDF summarization needs. Start free and scale as you grow.
            </p>
            <div className="inline-flex items-center bg-green-500/20 text-green-400 px-6 py-3 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Special: Admin users get unlimited free access!
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              // Handle free plan separately
              if (plan.id === 'free') {
                return (
                  <motion.div
                    key={index}
                    className="relative bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mb-4`}>
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-4">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">Free</span>
                        <span className="text-gray-400 ml-2">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      className="w-full py-4 rounded-xl font-medium transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/'}
                    >
                      {plan.buttonText}
                    </motion.button>
                  </motion.div>
                )
              }

              // Use RazorpayPayment for paid plans
              return (
                <RazorpayPayment
                  key={index}
                  plan={plan.id}
                  amount={plan.price}
                  features={plan.features}
                  popular={plan.popular}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">What&apos;s Included</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Compare features across all plans to find the perfect fit for your needs.
            </p>
          </motion.div>

          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 text-white font-medium">Feature</th>
                    <th className="text-center py-4 text-white font-medium">Free</th>
                    <th className="text-center py-4 text-white font-medium">Starter</th>
                    <th className="text-center py-4 text-white font-medium">Professional</th>
                    <th className="text-center py-4 text-white font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    ["Monthly Summaries", "5", "50", "500", "Unlimited"],
                    ["File Size Limit", "10MB", "50MB", "100MB", "Unlimited"],
                    ["AI Processing", "Basic", "Advanced", "Premium", "Custom"],
                    ["Support", "Standard", "Priority", "Priority", "24/7 Dedicated"],
                    ["API Access", "❌", "❌", "✅", "✅"],
                    ["Custom Templates", "❌", "❌", "✅", "✅"],
                    ["Team Collaboration", "❌", "❌", "✅", "✅"],
                    ["Advanced Analytics", "❌", "Basic", "✅", "✅"],
                    ["SSO Integration", "❌", "❌", "❌", "✅"],
                    ["On-premise Deployment", "❌", "❌", "❌", "✅"]
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="py-4 font-medium">{row[0]}</td>
                      <td className="text-center py-4">{row[1]}</td>
                      <td className="text-center py-4">{row[2]}</td>
                      <td className="text-center py-4">{row[3]}</td>
                      <td className="text-center py-4">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Have questions about our pricing? We&apos;ve got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have revolutionized their PDF processing with KamiScan&apos;s AI-powered technology.
            </p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Free Trial Today</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
