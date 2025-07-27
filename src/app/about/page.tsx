'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, Award, Globe } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation First",
      description: "We continuously push the boundaries of AI technology to deliver cutting-edge document processing solutions.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "User-Centric Design",
      description: "Every feature is designed with our users in mind, ensuring intuitive and delightful experiences.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Intelligent Solutions",
      description: "We believe in the power of AI to solve complex problems and simplify everyday tasks.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Our development is guided by user feedback and real-world needs from our growing community.",
      color: "from-green-500 to-teal-500"
    }
  ]

  const team = [
    {
      name: "Vaibhav Chauhan",
      role: "Founder & CEO",
      description: "Visionary leader with expertise in AI and document processing technologies.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "AI Development Team",
      role: "Core Engineers",
      description: "Dedicated team of AI specialists and full-stack developers.",
      image: "/api/placeholder/200/200"
    },
    {
      name: "UX/UI Design Team",
      role: "Design Experts",
      description: "Creative professionals focused on user experience and interface design.",
      image: "/api/placeholder/200/200"
    }
  ]

  const milestones = [
    {
      year: "2024",
      title: "KamiScan Launch",
      description: "Official launch of KamiScan with AI-powered PDF summarization technology."
    },
    {
      year: "2024",
      title: "Google Gemini Integration",
      description: "Partnership with Google to integrate advanced Gemini AI for enhanced processing."
    },
    {
      year: "2024",
      title: "Security Framework",
      description: "Implementation of enterprise-grade security and compliance measures."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanding services worldwide with multi-language support and regional data centers."
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
              About KamiScan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              We&apos;re on a mission to revolutionize document processing through innovative AI technology, 
              making information more accessible and actionable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                At KamiScan, we believe that everyone should have access to intelligent document processing tools. 
                Our mission is to democratize AI technology and make it accessible to individuals, businesses, 
                and organizations of all sizes.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We&apos;re committed to building solutions that not only solve complex problems but also provide 
                an exceptional user experience with zero latency and maximum security.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/400/300')] opacity-10"></div>
                <div className="relative z-10">
                  <Globe className="w-16 h-16 text-white mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4 text-center">
                    Global Impact
                  </h3>
                  <p className="text-purple-100 text-center mb-6">
                    Transforming how millions of people interact with documents worldwide
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white">50+</div>
                      <div className="text-purple-200 text-sm">Countries Served</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">1M+</div>
                      <div className="text-purple-200 text-sm">Documents Processed</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at KamiScan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind KamiScan&apos;s innovation and success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-purple-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Key milestones in KamiScan&apos;s development and growth.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-blue-500 h-full"></div>
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center mb-4">
                        <Award className="w-6 h-6 text-purple-400 mr-3" />
                        <span className="text-purple-400 font-bold text-lg">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-gray-900"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
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
              Join Our Mission
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Be part of the document processing revolution. Experience the future of AI-powered summarization today.
            </p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey with KamiScan
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
