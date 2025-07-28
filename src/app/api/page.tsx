'use client'

import { motion } from 'framer-motion'
import { Code, Zap, Shield, Globe, Copy, Check, Terminal, Book } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function APIPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Process PDFs in under 2 seconds with our optimized API endpoints",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime SLA guarantee",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global CDN",
      description: "Worldwide availability with regional data centers for optimal performance",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Developer Friendly",
      description: "RESTful API with comprehensive documentation and SDKs",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/summarize",
      description: "Generate AI-powered summary from PDF document",
      params: ["file", "options"]
    },
    {
      method: "GET",
      path: "/api/v1/summaries",
      description: "Retrieve list of processed summaries",
      params: ["limit", "offset", "filter"]
    },
    {
      method: "GET",
      path: "/api/v1/summaries/{id}",
      description: "Get specific summary by ID",
      params: ["id"]
    },
    {
      method: "DELETE",
      path: "/api/v1/summaries/{id}",
      description: "Delete summary by ID",
      params: ["id"]
    }
  ]

  const codeExamples = {
    curl: `curl -X POST "https://api.kamiscan.com/v1/summarize" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@document.pdf" \\
  -F "options={\\"maxLength\\": 500, \\"format\\": \\"bullets\\"}"`,
    
    javascript: `const formData = new FormData();
formData.append('file', pdfFile);
formData.append('options', JSON.stringify({
  maxLength: 500,
  format: 'bullets'
}));

const response = await fetch('https://api.kamiscan.com/v1/summarize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
// Handle the result
displaySummary(result.summary);`,

    python: `import requests

url = "https://api.kamiscan.com/v1/summarize"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

files = {"file": open("document.pdf", "rb")}
data = {"options": '{"maxLength": 500, "format": "bullets"}'}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
print(result["summary"])`,

    php: `<?php
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api.kamiscan.com/v1/summarize",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => array(
    "Authorization: Bearer YOUR_API_KEY"
  ),
  CURLOPT_POSTFIELDS => array(
    'file' => new CURLFile('document.pdf'),
    'options' => '{"maxLength": 500, "format": "bullets"}'
  )
));

$response = curl_exec($curl);
$result = json_decode($response, true);
echo $result['summary'];
curl_close($curl);
?>`
  }

  const [activeTab, setActiveTab] = useState('curl')

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      requests: "100 requests/month",
      features: ["Basic summarization", "Standard support", "Rate limit: 5/min"]
    },
    {
      name: "Pro",
      price: "$29",
      requests: "10,000 requests/month",
      features: ["Advanced AI", "Priority support", "Rate limit: 100/min", "Custom formats"]
    },
    {
      name: "Enterprise",
      price: "Custom",
      requests: "Unlimited requests",
      features: ["Custom AI models", "24/7 support", "No rate limits", "SLA guarantee", "On-premise option"]
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
              KamiScan API
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Integrate AI-powered PDF summarization into your applications with our robust, 
              scalable API. Built for developers, designed for performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get API Key
              </motion.button>
              <motion.button
                className="border border-purple-500 text-purple-400 px-8 py-4 rounded-xl font-medium hover:bg-purple-500/10 transition-colors inline-flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Book className="w-5 h-5" />
                <span>View Documentation</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">API Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need to integrate powerful PDF processing into your applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">API Endpoints</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              RESTful API endpoints for all your PDF processing needs.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-purple-400 font-mono text-lg">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-300 mb-3">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param, paramIndex) => (
                        <span key={paramIndex} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-mono">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try It
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Code Examples</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get started quickly with these code examples in your preferred language.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Language Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(codeExamples).map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                    activeTab === lang
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'javascript' ? 'JavaScript' : lang.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {/* Code Block */}
            <motion.div
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-medium capitalize">
                    {activeTab === 'javascript' ? 'JavaScript' : activeTab.toUpperCase()} Example
                  </span>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples], activeTab)}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedCode === activeTab ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-300">
                    {copiedCode === activeTab ? 'Copied!' : 'Copy'}
                  </span>
                </motion.button>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API Pricing */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">API Pricing</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Flexible pricing plans to fit your integration needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 ${
                  tier.name === 'Pro' 
                    ? 'border-purple-500/50 scale-105' 
                    : 'border-gray-700/50 hover:border-purple-500/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: tier.name === 'Pro' ? 1.08 : 1.03 }}
              >
                {tier.name === 'Pro' && (
                  <div className="text-center mb-4">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="text-gray-400 ml-2">/month</span>}
                  </div>
                  <p className="text-purple-400 font-medium">{tier.requests}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                    tier.name === 'Pro'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Integrate?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Start building with KamiScan API today. Get your API key and begin integrating 
              AI-powered PDF processing into your applications in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Free API Key
              </motion.button>
              <motion.button
                className="border border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Documentation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
