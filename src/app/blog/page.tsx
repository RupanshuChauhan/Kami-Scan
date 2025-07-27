'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Search, Tag, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'ai', name: 'AI & Machine Learning', count: 5 },
    { id: 'product', name: 'Product Updates', count: 3 },
    { id: 'tutorials', name: 'Tutorials', count: 2 },
    { id: 'company', name: 'Company News', count: 2 }
  ]

  const featuredPost = {
    title: "The Future of AI-Powered Document Processing",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we handle, analyze, and extract insights from documents across industries.",
    author: "KamiScan Team",
    date: "January 25, 2025",
    readTime: "8 min read",
    category: "AI & Machine Learning",
    image: "/api/placeholder/800/400",
    featured: true
  }

  const blogPosts = [
    {
      title: "Introducing KamiScan 2.0: Enhanced AI Processing",
      excerpt: "Our latest update brings faster processing speeds, improved accuracy, and new features that make document summarization even more powerful.",
      author: "Vaibhav Chauhan",
      date: "January 20, 2025",
      readTime: "5 min read",
      category: "Product Updates",
      image: "/api/placeholder/400/250"
    },
    {
      title: "How to Maximize Your PDF Summarization Workflow",
      excerpt: "Learn best practices for organizing, processing, and managing your documents with KamiScan's advanced features.",
      author: "Sarah Johnson",
      date: "January 15, 2025",
      readTime: "6 min read",
      category: "Tutorials",
      image: "/api/placeholder/400/250"
    },
    {
      title: "The Science Behind Our AI Summarization Engine",
      excerpt: "Deep dive into the machine learning algorithms and natural language processing techniques that power KamiScan.",
      author: "Dr. Michael Chen",
      date: "January 10, 2025",
      readTime: "10 min read",
      category: "AI & Machine Learning",
      image: "/api/placeholder/400/250"
    },
    {
      title: "KamiScan for Enterprise: Security and Compliance",
      excerpt: "Understanding how KamiScan meets enterprise security requirements and maintains compliance with industry standards.",
      author: "Emily Rodriguez",
      date: "January 5, 2025",
      readTime: "7 min read",
      category: "Company News",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Getting Started with KamiScan: A Complete Guide",
      excerpt: "Everything you need to know to start using KamiScan effectively, from account setup to advanced features.",
      author: "Alex Thompson",
      date: "December 30, 2024",
      readTime: "4 min read",
      category: "Tutorials",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Machine Learning Trends in Document Processing",
      excerpt: "Explore the latest trends and innovations in ML-driven document analysis and what they mean for the future.",
      author: "Dr. Lisa Park",
      date: "December 25, 2024",
      readTime: "9 min read",
      category: "AI & Machine Learning",
      image: "/api/placeholder/400/250"
    }
  ]

  const trendingTopics = [
    "AI Document Processing",
    "PDF Summarization",
    "Machine Learning",
    "Enterprise Security",
    "Workflow Automation",
    "Natural Language Processing"
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

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
              KamiScan Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Insights, tutorials, and updates from the world of AI-powered document processing. 
              Stay informed about the latest trends and best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Select category"
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Trending Topics */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {trendingTopics.map((topic, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-full text-sm text-gray-300 hover:border-purple-500/50 cursor-pointer transition-all"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Tag className="w-3 h-3 inline mr-2" />
                    {topic}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-3xl overflow-hidden border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 lg:p-12">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-8">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all inline-flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 lg:p-4">
                <div className="bg-gray-800 rounded-2xl h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-gray-300">Featured Article Image</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Latest Articles</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover insights, tips, and updates from our team of experts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80 text-sm">Article Image</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <motion.button
                    className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center space-x-2 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss an update about new features, 
              AI insights, and industry trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500"
              />
              <motion.button
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
