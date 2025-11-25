'use client'

import { useState } from 'react'
import ChartCard from '@/components/ChartCard'
import { User, Mail, Shield, Bell, Palette, Globe, Save, Camera } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    role: user?.role || 'viewer',
    bio: '',
    location: '',
    website: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
    security: true
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[#141a21] p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'bg-[#54e4a6] text-white shadow-[0_0_15px_rgba(84,228,166,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1c222b]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Profile Information">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-[#5ac8fa] rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white hover:bg-[#1c222b] transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Change Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </ChartCard>
          </div>

          <div>
            <ChartCard title="Account Status">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-medium capitalize">{profileData.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white font-medium">Nov 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reports Generated</span>
                  <span className="text-white font-medium">12</span>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <ChartCard title="Notification Preferences">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <p className="text-gray-400 text-sm">Receive {key.toLowerCase()} notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#54e4a6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#54e4a6]"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </ChartCard>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <ChartCard title="Appearance & Preferences">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={appearanceSettings.language}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select
                  value={appearanceSettings.timezone}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, timezone: e.target.value})}
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                <select
                  value={appearanceSettings.dateFormat}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, dateFormat: e.target.value})}
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#54e4a6]"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </ChartCard>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Password & Authentication">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 bg-[#141a21] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#54e4a6] focus:border-[#54e4a6]"
                />
              </div>

              <button className="w-full py-2 bg-[#54e4a6] text-white rounded-lg hover:bg-[#54e4a6]/80 transition-colors">
                Update Password
              </button>
            </div>
          </ChartCard>

          <ChartCard title="Two-Factor Authentication">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Enable 2FA</h4>
                  <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#54e4a6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#54e4a6]"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button className="w-full py-2 bg-[#141a21] border border-gray-700 text-white rounded-lg hover:bg-[#1c222b] transition-colors">
                  Configure 2FA
                </button>
              </div>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  )
}