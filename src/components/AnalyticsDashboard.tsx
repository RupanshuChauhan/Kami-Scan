'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  BarChart, TrendingUp, FileText, Clock, Zap, Users, Brain,
  Calendar, Download, Share2, Filter, MoreVertical, ArrowUp,
  ArrowDown, Target, Activity, PieChart, LineChart, Globe,
  Bookmark, Star, Eye, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalyticsData {
  totalSummaries: number
  weeklyUsage: Array<{ day: string; count: number; date: string }>
  monthlyUsage: Array<{ month: string; summaries: number; timesSaved: number; date: string }>
  topCategories: Array<{ category: string; count: number; percentage: number; color: string }>
  averageProcessingTime: number
  accuracyScore: number
  totalTimeSaved: number
  userGrowth: number
  activeUsers: number
  conversionRate: number
  retentionRate: number
  popularFeatures: Array<{ feature: string; usage: number; trend: 'up' | 'down' | 'stable' }>
  geographicData: Array<{ country: string; users: number; percentage: number }>
  performanceMetrics: {
    successRate: number
    errorRate: number
    averageResponseTime: number
    peakUsageHour: number
  }
  recentActivity: Array<{
    id: string
    type: 'summary' | 'chat' | 'export' | 'share'
    user: string
    document: string
    timestamp: Date
    duration?: number
  }>
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
}

function MetricCard({ title, value, change, icon: Icon, color, trend, subtitle }: MetricCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {change > 0 ? <ArrowUp size={16} /> : change < 0 ? <ArrowDown size={16} /> : null}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  type: 'bar' | 'line' | 'pie'
  className?: string
}

function SimpleChart({ data, type, className = '' }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  if (type === 'bar') {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20 truncate">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color || 'bg-blue-600'}`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className={`flex items-end justify-between h-32 ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <motion.div
              className={`${item.color || 'bg-blue-600'} rounded-t`}
              style={{ width: '24px' }}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 120}px` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            <span className="text-xs text-gray-600 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  // Pie chart (simplified as stacked bars for now)
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex h-4 rounded-full overflow-hidden">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className={item.color || 'bg-blue-600'}
            initial={{ width: 0 }}
            animate={{ width: `${(item.value / total) * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color || 'bg-blue-600'}`} />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const exportData = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&range=${timeRange}`, {
        method: 'GET',
      })
      
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Analytics exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export analytics')
    }
  }

  const chartData = useMemo(() => {
    if (!data) return { weekly: [], categories: [], features: [] }
    
    return {
      weekly: data.weeklyUsage.map(day => ({
        label: day.day.slice(0, 3),
        value: day.count,
        color: 'bg-blue-600'
      })),
      categories: data.topCategories.map(cat => ({
        label: cat.category,
        value: cat.count,
        color: cat.color
      })),
      features: data.popularFeatures.map(feature => ({
        label: feature.feature,
        value: feature.usage,
        color: feature.trend === 'up' ? 'bg-green-600' : feature.trend === 'down' ? 'bg-red-600' : 'bg-gray-600'
      }))
    }
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <div>Failed to load analytics</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your PDF processing activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => fetchAnalytics()}
              disabled={refreshing}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <Activity size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            
            <div className="relative group">
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Download size={16} />
              </button>
              
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => exportData('csv')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => exportData('excel')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={() => exportData('pdf')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Documents"
          value={data.totalSummaries.toLocaleString()}
          change={data.userGrowth}
          icon={FileText}
          color="bg-blue-600"
          subtitle="Processed this period"
        />
        
        <MetricCard
          title="Processing Speed"
          value={`${data.averageProcessingTime}s`}
          change={-15}
          icon={Zap}
          color="bg-purple-600"
          subtitle="Average time per document"
        />
        
        <MetricCard
          title="Time Saved"
          value={`${Math.round(data.totalTimeSaved)}h`}
          change={23}
          icon={Clock}
          color="bg-green-600"
          subtitle="Reading time saved"
        />
        
        <MetricCard
          title="Accuracy Score"
          value={`${data.accuracyScore}%`}
          change={2.1}
          icon={Target}
          color="bg-orange-600"
          subtitle="AI processing accuracy"
        />
        
        <MetricCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          change={data.userGrowth}
          icon={Users}
          color="bg-pink-600"
          subtitle="Monthly active users"
        />
        
        <MetricCard
          title="Success Rate"
          value={`${data.performanceMetrics.successRate}%`}
          change={1.5}
          icon={TrendingUp}
          color="bg-indigo-600"
          subtitle="Processing success rate"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          change={-2.3}
          icon={Star}
          color="bg-yellow-600"
          subtitle="Free to paid conversion"
        />
        
        <MetricCard
          title="Retention Rate"
          value={`${data.retentionRate}%`}
          change={5.7}
          icon={Bookmark}
          color="bg-teal-600"
          subtitle="30-day user retention"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Trend */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Usage Trend</h3>
            <LineChart size={20} className="text-gray-400" />
          </div>
          
          <SimpleChart data={chartData.weekly} type="line" />
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Peak usage</span>
              <span className="font-medium text-gray-900">
                {data.performanceMetrics.peakUsageHour}:00
              </span>
            </div>
          </div>
        </motion.div>

        {/* Document Categories */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Categories</h3>
            <PieChart size={20} className="text-gray-400" />
          </div>
          
          <SimpleChart data={chartData.categories} type="pie" />
        </motion.div>

        {/* Popular Features */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Usage</h3>
            <BarChart size={20} className="text-gray-400" />
          </div>
          
          <SimpleChart data={chartData.features} type="bar" />
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <Globe size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {data.geographicData.slice(0, 5).map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{country.country}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {country.users}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Eye size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {data.recentActivity.slice(0, 10).map((activity) => {
            const getActivityIcon = () => {
              switch (activity.type) {
                case 'summary': return <FileText size={16} className="text-blue-600" />
                case 'chat': return <MessageSquare size={16} className="text-green-600" />
                case 'export': return <Download size={16} className="text-purple-600" />
                case 'share': return <Share2 size={16} className="text-orange-600" />
                default: return <Activity size={16} className="text-gray-600" />
              }
            }

            return (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  {getActivityIcon()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user} {activity.type}d &quot;{activity.document}&quot;
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                    {activity.duration && ` • ${activity.duration}s`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-blue-600" size={20} />
              <h4 className="font-medium text-gray-900">Processing Optimization</h4>
            </div>
            <p className="text-sm text-gray-600">
              Your processing speed has improved by 15% this month. Consider upgrading to Pro for even faster results.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <h4 className="font-medium text-gray-900">Usage Growth</h4>
            </div>
            <p className="text-sm text-gray-600">
              Your document processing has increased by 23% compared to last month. Great progress!
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-orange-600" size={20} />
              <h4 className="font-medium text-gray-900">Accuracy Boost</h4>
            </div>
            <p className="text-sm text-gray-600">
              Try our new Expert mode for 95%+ accuracy on complex technical documents.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
