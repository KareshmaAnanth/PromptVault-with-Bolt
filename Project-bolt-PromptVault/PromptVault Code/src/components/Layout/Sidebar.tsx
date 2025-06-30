import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, FolderOpen, BookTemplate as Template, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Prompts', path: '/prompts' },
  { icon: FolderOpen, label: 'Collections', path: '/collections' },
  { icon: Template, label: 'Templates', path: '/templates' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

// Creative PromptVault Logo Component
function PromptVaultLogo() {
  return (
    <div className="relative w-8 h-8">
      {/* Vault/Safe base */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg">
        {/* Vault door */}
        <div className="absolute inset-1 bg-slate-800 rounded-md border border-teal-300/30">
          {/* Central lock mechanism */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm">
              {/* Lock center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
          {/* Vault handle */}
          <div className="absolute top-1 right-0.5 w-1 h-2 bg-gradient-to-b from-slate-400 to-slate-500 rounded-sm"></div>
        </div>
        {/* Sparkle effects for "smart" prompts */}
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-teal-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <PromptVaultLogo />
          <h1 className="text-xl font-bold text-white">PromptVault</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          Built with{' '}
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Bolt.new
          </a>
        </div>
      </div>
    </aside>
  )
}