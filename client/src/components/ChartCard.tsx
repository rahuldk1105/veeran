'use client'

import { MoreVertical, Download, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  onRefresh?: () => void
  onDownload?: () => void
  className?: string
}

export default function ChartCard({ 
  title, 
  children, 
  onRefresh, 
  onDownload,
  className = ''
}: ChartCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={`bg-[#1c222b] border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-[#54e4a6]/5 transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#141a21] rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#141a21] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#141a21] rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1c222b] border border-gray-700 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#141a21] hover:text-white">
                    View Details
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#141a21] hover:text-white">
                    Export Data
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#141a21] hover:text-white">
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {children}
      </div>
    </div>
  )
}