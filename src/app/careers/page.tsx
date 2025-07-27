'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, Heart, Lightbulb, Globe, ArrowRight, Code, Palette, TrendingUp } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function CareersPage() {
  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Learning & Growth",
      description: "Professional development budget, conference attendance, and skill advancement opportunities.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Remote Flexibility",
      description: "Work from anywhere with flexible hours and a strong remote-first culture.",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Inclusive Culture",
      description: "Diverse, inclusive environment where every voice is heard and valued.",
      color: "from-purple-500 to-indigo-500"
    }
  ]

  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      icon: <Code className="w-6 h-6" />,
      description: "Lead the development of our AI-powered PDF processing engine using cutting-edge machine learning technologies."
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      icon: <Code className="w-6 h-6" />,
      description: "Create beautiful, responsive user interfaces using React, TypeScript, and modern frontend technologies."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / London",
      type: "Full-time",
      icon: <Palette className="w-6 h-6" />,
      description: "Design intuitive user experiences that make complex AI technology accessible and delightful to use."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: <Code className="w-6 h-6" />,
      description: "Build and maintain scalable infrastructure to support our growing user base and AI processing needs."
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "San Francisco",
      type: "Full-time",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Drive product adoption and growth through strategic marketing initiatives and user engagement programs."
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      icon: <Users className="w-6 h-6" />,
      description: "Help our users succeed with KamiScan by providing exceptional support and building lasting relationships."
    }
  ]

  const values = [
    "Innovation drives everything we do",
    "User success is our primary measure of success",
    "Transparency and honesty in all communications",
    "Continuous learning and improvement",
    "Work-life balance and mental health matter",
    "Diversity makes us stronger"
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
              Join Our Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Help us revolutionize document processing with AI. Join a team of passionate innovators 
              building the future of intelligent document analysis.
            </p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Open Positions</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">Why KamiScan?</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                At KamiScan, we&apos;re not just building software – we&apos;re creating the future of how people 
                interact with documents. Our team is passionate about using AI to solve real problems and 
                make technology more accessible.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                We believe in fostering an environment where creativity thrives, where every team member 
                can grow professionally, and where innovation happens through collaboration.
              </p>
              <div className="space-y-3">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{value}</span>
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
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <Briefcase className="w-16 h-16 text-white mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-4 text-center">
                    Growing Team
                  </h3>
                  <p className="text-purple-100 text-center mb-6">
                    Join a rapidly expanding team of talented professionals from around the world
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white">50+</div>
                      <div className="text-purple-200 text-sm">Team Members</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">15</div>
                      <div className="text-purple-200 text-sm">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Benefits & Perks</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We believe in taking care of our team members with comprehensive benefits and perks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Find your next opportunity with us. We&apos;re always looking for talented individuals to join our mission.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-purple-500/20 rounded-lg p-3">
                      {position.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{position.title}</h3>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {position.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                      </div>
                      <p className="text-gray-300">{position.description}</p>
                    </div>
                  </div>
                  <motion.button
                    className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-400 mb-6">
              Don&apos;t see a position that matches your skills? We&apos;d still love to hear from you!
            </p>
            <motion.button
              className="px-8 py-3 border border-purple-500 text-purple-400 rounded-lg font-medium hover:bg-purple-500/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Us Your Resume
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Shape the Future?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join KamiScan and help us build the next generation of AI-powered document processing tools. 
              Your ideas and expertise can make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All Positions
              </motion.button>
              <motion.button
                className="border border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About Our Culture
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
