import React from 'react'
import { User, Shield, Database, Bell, Palette } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'
import { useAuth } from '../hooks/useAuth'

export function Settings() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and application preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors">
                Update Profile
              </button>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Local Storage</h3>
                  <p className="text-slate-400 text-sm">Store data locally for enhanced privacy</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Data Encryption</h3>
                  <p className="text-slate-400 text-sm">Encrypt sensitive prompt data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors">
                Export All Data
              </button>
              
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors">
                Import Data
              </button>
              
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors">
                Clear Local Cache
              </button>
              
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors">
                Delete All Data
              </button>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-slate-400 text-sm">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Browser Notifications</h3>
                  <p className="text-slate-400 text-sm">Show desktop notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Theme
                </label>
                <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500">
                  <option>Dark (Current)</option>
                  <option>Light</option>
                  <option>System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Accent Color
                </label>
                <div className="flex space-x-2">
                  {['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Built with Bolt.new Badge */}
        <div className="text-center py-6 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Built with{' '}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              Bolt.new
            </a>
          </p>
        </div>
      </div>
    </Layout>
  )
}