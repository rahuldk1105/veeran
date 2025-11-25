'use client'

import { useState, useEffect } from 'react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import FilterChip from '@/components/FilterChip'
import { TrendingUp, Users, DollarSign, Activity, ShoppingCart, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [metrics, setMetrics] = useState([
    { title: 'Total Revenue', value: '$45,231', change: 12.5, changeType: 'increase' as const, category: 'Finance' },
    { title: 'Active Users', value: '2,345', change: 8.2, changeType: 'increase' as const, category: 'Users' },
    { title: 'Conversion Rate', value: '3.24%', change: -2.1, changeType: 'decrease' as const, category: 'Sales' },
    { title: 'Avg. Order Value', value: '$128', change: 5.7, changeType: 'increase' as const, category: 'Sales' },
  ])

  const filters = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'active', label: 'Active', status: 'success' as const, count: 18 },
    { id: 'pending', label: 'Pending', status: 'warning' as const, count: 4 },
    { id: 'inactive', label: 'Inactive', status: 'error' as const, count: 2 },
  ]

  const recentItems = [
    { id: 1, name: 'User Registration', status: 'success', value: '+23', time: '2 min ago' },
    { id: 2, name: 'Order Completed', status: 'success', value: '$156', time: '5 min ago' },
    { id: 3, name: 'Payment Failed', status: 'error', value: '$89', time: '8 min ago' },
    { id: 4, name: 'New Comment', status: 'info', value: '1', time: '12 min ago' },
    { id: 5, name: 'User Login', status: 'success', value: '+1', time: '15 min ago' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-[#54e4a6]'
      case 'error': return 'bg-[#ff5f6d]'
      case 'info': return 'bg-[#5ac8fa]'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-3">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            status={filter.status}
            count={filter.count}
            active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          />
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            category={metric.category}
            icon={
              index === 0 ? <DollarSign className="w-5 h-5 text-[#54e4a6]" /> :
              index === 1 ? <Users className="w-5 h-5 text-[#5ac8fa]" /> :
              index === 2 ? <BarChart3 className="w-5 h-5 text-[#ffbd59]" /> :
              <ShoppingCart className="w-5 h-5 text-[#ff5f6d]" />
            }
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Revenue Trend" 
          onRefresh={() => console.log('Refreshing revenue data')}
          onDownload={() => console.log('Downloading revenue data')}
        >
          <div className="h-64 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-[#54e4a6] mx-auto mb-2" />
              <p className="text-gray-400">Revenue Chart</p>
              <p className="text-sm text-gray-500 mt-1">Chart visualization will be implemented</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="User Activity" 
          onRefresh={() => console.log('Refreshing user data')}
          onDownload={() => console.log('Downloading user data')}
        >
          <div className="h-64 flex items-center justify-center bg-[#141a21] rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-[#5ac8fa] mx-auto mb-2" />
              <p className="text-gray-400">Activity Chart</p>
              <p className="text-sm text-gray-500 mt-1">Chart visualization will be implemented</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Recent Activity">
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#141a21] rounded-lg hover:bg-[#1c222b] transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-semibold">{item.value}</span>
                    <span className="text-gray-500 text-sm">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div>
          <ChartCard title="Quick Stats">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#141a21] rounded-lg">
                <span className="text-gray-400">Today's Revenue</span>
                <span className="text-white font-semibold">$1,234</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#141a21] rounded-lg">
                <span className="text-gray-400">New Users</span>
                <span className="text-white font-semibold">+45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#141a21] rounded-lg">
                <span className="text-gray-400">Active Sessions</span>
                <span className="text-white font-semibold">128</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#141a21] rounded-lg">
                <span className="text-gray-400">Bounce Rate</span>
                <span className="text-white font-semibold">32.5%</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}