'use client'

import { useState } from 'react'
import ChartCard from '@/components/ChartCard'
import FilterChip from '@/components/FilterChip'
import { Calendar, Download, Filter, BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const dateRanges = [
    { id: '1d', label: 'Today' },
    { id: '7d', label: 'Last 7 days' },
    { id: '30d', label: 'Last 30 days' },
    { id: '90d', label: 'Last 90 days' },
    { id: '1y', label: 'Last year' },
  ]

  const categories = [
    { id: 'all', label: 'All Categories', count: 156 },
    { id: 'sales', label: 'Sales', status: 'success' as const, count: 89 },
    { id: 'users', label: 'Users', status: 'info' as const, count: 45 },
    { id: 'revenue', label: 'Revenue', status: 'warning' as const, count: 22 },
  ]

  const exportOptions = [
    { id: 'csv', label: 'Export as CSV' },
    { id: 'pdf', label: 'Export as PDF' },
    { id: 'json', label: 'Export as JSON' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Detailed insights and data analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white hover:bg-[#1c222b] transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-[#1c222b] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <FilterChip
                    key={category.id}
                    label={category.label}
                    status={category.status}
                    count={category.count}
                    active={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Revenue Analytics" 
          onRefresh={() => console.log('Refreshing revenue analytics')}
          onDownload={() => console.log('Downloading revenue analytics')}
        >
          <div className="h-80 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-[#54e4a6] mx-auto mb-3" />
              <p className="text-gray-400">Revenue Analytics Chart</p>
              <p className="text-sm text-gray-500 mt-1">Interactive chart visualization</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="User Growth" 
          onRefresh={() => console.log('Refreshing user growth data')}
          onDownload={() => console.log('Downloading user growth data')}
        >
          <div className="h-80 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-[#5ac8fa] mx-auto mb-3" />
              <p className="text-gray-400">User Growth Chart</p>
              <p className="text-sm text-gray-500 mt-1">Growth trend visualization</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="Traffic Sources" 
          onRefresh={() => console.log('Refreshing traffic sources')}
          onDownload={() => console.log('Downloading traffic sources')}
        >
          <div className="h-80 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-[#ffbd59] mx-auto mb-3" />
              <p className="text-gray-400">Traffic Sources Chart</p>
              <p className="text-sm text-gray-500 mt-1">Source distribution visualization</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="Conversion Funnel" 
          onRefresh={() => console.log('Refreshing conversion funnel')}
          onDownload={() => console.log('Downloading conversion funnel')}
        >
          <div className="h-80 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <Activity className="w-16 h-16 text-[#ff5f6d] mx-auto mb-3" />
              <p className="text-gray-400">Conversion Funnel Chart</p>
              <p className="text-sm text-gray-500 mt-1">Funnel analysis visualization</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Data Table */}
      <ChartCard title="Detailed Analytics Data">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Metric</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Change</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-[#141a21]">
                <td className="py-3 px-4 text-white">Page Views</td>
                <td className="py-3 px-4 text-white">24,567</td>
                <td className="py-3 px-4 text-[#54e4a6]">+12.5%</td>
                <td className="py-3 px-4 text-gray-400">Traffic</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-[#141a21]">
                <td className="py-3 px-4 text-white">Bounce Rate</td>
                <td className="py-3 px-4 text-white">32.4%</td>
                <td className="py-3 px-4 text-[#ff5f6d]">-2.1%</td>
                <td className="py-3 px-4 text-gray-400">Engagement</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-[#141a21]">
                <td className="py-3 px-4 text-white">Session Duration</td>
                <td className="py-3 px-4 text-white">4m 32s</td>
                <td className="py-3 px-4 text-[#54e4a6]">+8.7%</td>
                <td className="py-3 px-4 text-gray-400">Engagement</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-[#141a21]">
                <td className="py-3 px-4 text-white">Conversion Rate</td>
                <td className="py-3 px-4 text-white">3.24%</td>
                <td className="py-3 px-4 text-[#ffbd59]">+0.5%</td>
                <td className="py-3 px-4 text-gray-400">Sales</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}