'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  category?: string
  icon?: React.ReactNode
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  category,
  icon 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-[#54e4a6]" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-[#ff5f6d]" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-[#54e4a6]'
      case 'decrease':
        return 'text-[#ff5f6d]'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="bg-[#1c222b] border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-[#54e4a6]/5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-[#54e4a6]/20 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            {category && (
              <span className="text-xs text-gray-500">{category}</span>
            )}
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {changeType === 'increase' ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}