'use client'

import { useState } from 'react'
import ChartCard from '@/components/ChartCard'
import FilterChip from '@/components/FilterChip'
import { 
  Plus, 
  Download, 
  Share2, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('library')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const reportTemplates = [
    {
      id: 'sales-summary',
      name: 'Sales Summary Report',
      description: 'Comprehensive overview of sales performance',
      type: 'sales',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-[#54e4a6]',
      bgColor: 'bg-[#54e4a6]/20'
    },
    {
      id: 'user-analytics',
      name: 'User Analytics Report',
      description: 'Detailed user behavior and engagement metrics',
      type: 'analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-[#5ac8fa]',
      bgColor: 'bg-[#5ac8fa]/20'
    },
    {
      id: 'revenue-breakdown',
      name: 'Revenue Breakdown Report',
      description: 'Revenue analysis by category and time period',
      type: 'revenue',
      icon: <PieChart className="w-5 h-5" />,
      color: 'text-[#ffbd59]',
      bgColor: 'bg-[#ffbd59]/20'
    },
  ]

  const generatedReports = [
    {
      id: '1',
      name: 'Q4 2024 Sales Report',
      type: 'Sales',
      status: 'Ready',
      generatedAt: '2024-11-25',
      size: '2.3 MB',
      preview: 'Comprehensive sales analysis for Q4 2024 with detailed breakdowns...'
    },
    {
      id: '2',
      name: 'November User Analytics',
      type: 'Analytics',
      status: 'Ready',
      generatedAt: '2024-11-24',
      size: '1.8 MB',
      preview: 'User engagement metrics and behavior analysis for November...'
    },
    {
      id: '3',
      name: 'Revenue Forecast 2025',
      type: 'Revenue',
      status: 'Processing',
      generatedAt: '2024-11-23',
      size: '-',
      preview: 'Revenue forecast and projections for the upcoming year...'
    },
  ]

  const tabs = [
    { id: 'library', label: 'Report Library' },
    { id: 'generator', label: 'Report Generator' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 mt-1">Generate and manage your reports</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[#141a21] p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-[#54e4a6] text-white shadow-[0_0_15px_rgba(84,228,166,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-[#1c222b]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Library */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <ChartCard title="Generated Reports">
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-[#141a21] rounded-lg hover:bg-[#1c222b] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#54e4a6]/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#54e4a6]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{report.name}</h4>
                      <p className="text-gray-400 text-sm">{report.preview}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.generatedAt}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <span className={`${
                          report.status === 'Ready' ? 'text-[#54e4a6]' : 
                          report.status === 'Processing' ? 'text-[#ffbd59]' : 
                          'text-[#ff5f6d]'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1c222b] rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1c222b] rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1c222b] rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#ff5f6d] hover:bg-[#1c222b] rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Report Generator */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Report Templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedReport(template.id)}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all duration-200
                      ${selectedReport === template.id 
                        ? 'border-[#54e4a6] bg-[#54e4a6]/10 shadow-[0_0_15px_rgba(84,228,166,0.2)]' 
                        : 'border-gray-700 bg-[#141a21] hover:border-gray-600 hover:bg-[#1c222b]'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${template.bgColor} rounded-lg flex items-center justify-center`}>
                        <div className={template.color}>
                          {template.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{template.name}</h4>
                        <p className="text-gray-400 text-sm">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                      <button className="text-[#54e4a6] hover:text-[#54e4a6]/80 text-sm font-medium">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <div>
            <ChartCard title="Report Configuration">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Report Name</label>
                  <input
                    type="text"
                    placeholder="Enter report name"
                    className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                  <select className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="format" value="pdf" defaultChecked className="text-[#54e4a6]" />
                      <span className="text-white">PDF</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="format" value="excel" className="text-[#54e4a6]" />
                      <span className="text-white">Excel</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="format" value="csv" className="text-[#54e4a6]" />
                      <span className="text-white">CSV</span>
                    </label>
                  </div>
                </div>

                <button 
                  className="w-full py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors"
                  disabled={!selectedReport}
                >
                  Generate Report
                </button>
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  )
}