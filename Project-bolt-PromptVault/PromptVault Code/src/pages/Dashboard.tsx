import React, { useState } from 'react'
import { FileText, FolderOpen, BookTemplate as Template, TrendingUp, Sparkles } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'
import { StatsCard } from '../components/Dashboard/StatsCard'
import { RecentPrompts } from '../components/Dashboard/RecentPrompts'
import { usePrompts } from '../hooks/usePrompts'
import { PromptEditor } from '../components/Prompts/PromptEditor'
import { AIPromptBuilder } from '../components/Prompts/AIPromptBuilder'
import { Database } from '../lib/supabase'

type Prompt = Database['public']['Tables']['prompts']['Row']

export function Dashboard() {
  const { prompts, collections, recentPrompts, favoritePrompts, createPrompt } = usePrompts()
  const [showEditor, setShowEditor] = useState(false)
  const [showAIBuilder, setShowAIBuilder] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>()

  const handleCreatePrompt = () => {
    setSelectedPrompt(undefined)
    setShowEditor(true)
  }

  const handleCreateWithAI = () => {
    setShowAIBuilder(true)
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setShowEditor(true)
  }

  const handleSavePrompt = async (data: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createPrompt(data)
    setShowEditor(false)
  }

  const handleSaveAIPrompt = async (enhancedPrompt: string, title: string) => {
    await createPrompt({
      title,
      content: enhancedPrompt,
      output: '',
      collection_id: null,
      tags: [],
      is_favorite: false,
      is_template: false,
    })
    setShowAIBuilder(false)
  }

  const templateCount = prompts.filter(p => p.is_template).length

  return (
    <Layout onCreatePrompt={handleCreatePrompt}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome back! Here's what's happening with your prompts.</p>
          </div>
          
          <button
            onClick={handleCreateWithAI}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create with AI</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Prompts"
            value={prompts.length}
            description="Manage all your creative prompts"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Collections"
            value={collections.length}
            description="Organize prompts into groups"
            icon={FolderOpen}
          />
          <StatsCard
            title="Prompt Templates"
            value={templateCount}
            description="Get started with predefined templates"
            icon={Template}
          />
          <StatsCard
            title="Favorites"
            value={favoritePrompts.length}
            description="Your most cherished prompts"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Recent & Favorite Prompts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPrompts 
            prompts={recentPrompts} 
            onSelectPrompt={handleSelectPrompt}
          />
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Favorite Prompts</h2>
            </div>
            <p className="text-slate-400 mb-6">Your most cherished ideas.</p>
            
            {favoritePrompts.length === 0 ? (
              <div className="text-center">
                <p className="text-slate-500">No favorite prompts yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favoritePrompts.slice(0, 5).map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => handleSelectPrompt(prompt)}
                    className="group p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium text-white mb-1">{prompt.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {prompt.content.slice(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditor && (
        <PromptEditor
          prompt={selectedPrompt}
          collections={collections}
          onSave={handleSavePrompt}
          onClose={() => setShowEditor(false)}
        />
      )}

      {showAIBuilder && (
        <AIPromptBuilder
          onSave={handleSaveAIPrompt}
          onClose={() => setShowAIBuilder(false)}
        />
      )}
    </Layout>
  )
}