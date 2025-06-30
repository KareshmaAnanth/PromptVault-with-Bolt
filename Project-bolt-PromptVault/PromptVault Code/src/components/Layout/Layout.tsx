import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
  onSearch?: (query: string) => void
  onCreatePrompt?: () => void
}

export function Layout({ children, onSearch, onCreatePrompt }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onSearch={onSearch} onCreatePrompt={onCreatePrompt} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}