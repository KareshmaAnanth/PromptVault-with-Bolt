import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/Auth/AuthForm'
import { Dashboard } from './pages/Dashboard'
import { Prompts } from './pages/Prompts'
import { Collections } from './pages/Collections'
import { Templates } from './pages/Templates'
import { Settings } from './pages/Settings'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Temporarily bypass authentication for demo - remove this in production
  const demoMode = true
  
  if (!user && !demoMode) {
    return <AuthForm />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App