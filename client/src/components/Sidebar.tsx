'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Admin', href: '/admin', icon: Shield },
]

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const active = isActive(item.href)
    return (
      <Link
        href={item.href}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-[#54e4a6]/20 text-white shadow-[0_0_20px_rgba(84,228,166,0.3)] border border-[#54e4a6]/30' 
            : 'text-gray-400 hover:text-white hover:bg-[#1c222b]'
          }
        `}
      >
        <item.icon className={`w-5 h-5 ${active ? 'text-[#54e4a6]' : ''}`} />
        {!collapsed && <span className="font-medium">{item.name}</span>}
      </Link>
    )
  }

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} bg-[#141a21] border-r border-gray-800 flex flex-col transition-all duration-300`}>
      {/* Header with toggle */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-[#1c222b] rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {!collapsed && (
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
          </div>
        )}
        
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}

        {user?.role === 'admin' && (
          <>
            {!collapsed && (
              <div className="px-4 py-2 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</h3>
              </div>
            )}
            {adminNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-[#5ac8fa] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}