import React, { useState } from 'react'
import { Search, Filter, Grid, List, Plus, Sparkles } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'
import { PromptCard } from '../components/Prompts/PromptCard'
import { PromptEditor } from '../components/Prompts/PromptEditor'
import { AIPromptBuilder } from '../components/Prompts/AIPromptBuilder'
import { usePrompts } from '../hooks/usePrompts'
import { Database } from '../lib/supabase'
import { getAllTags } from '../utils/tagSuggestions'

type Prompt = Database['public']['Tables']['prompts']['Row']

export function Prompts() {
  const { prompts, collections, createPrompt, updatePrompt, deletePrompt, searchPrompts } = usePrompts()
  const [showEditor, setShowEditor] = useState(false)
  const [showAIBuilder, setShowAIBuilder] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    tags: [] as string[],
    collectionId: '',
    isFavorite: undefined as boolean | undefined,
  })

  const availableTags = getAllTags()
  const filteredPrompts = searchPrompts(searchQuery, filters)

  const handleCreatePrompt = () => {
    setSelectedPrompt(undefined)
    setShowEditor(true)
  }

  const handleCreateWithAI = () => {
    setShowAIBuilder(true)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setShowEditor(true)
  }

  const handleSavePrompt = async (data: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (selectedPrompt) {
      await updatePrompt(selectedPrompt.id, data)
    } else {
      await createPrompt(data)
    }
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

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      await deletePrompt(id)
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await updatePrompt(id, { is_favorite: isFavorite })
  }

  const handleCopy = (content: string) => {
    // Visual feedback could be added here
    console.log('Copied to clipboard:', content)
  }

  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <Layout onSearch={setSearchQuery}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Prompts</h1>
            <p className="text-slate-400">
              {filteredPrompts.length} of {prompts.length} prompts
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateWithAI}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Builder</span>
            </button>

            <button
              onClick={handleCreatePrompt}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Prompt</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Collection
                </label>
                <select
                  value={filters.collectionId}
                  onChange={(e) => setFilters(prev => ({ ...prev, collectionId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">All collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.isFavorite === undefined ? '' : filters.isFavorite.toString()}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    isFavorite: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">All prompts</option>
                  <option value="true">Favorites only</option>
                  <option value="false">Non-favorites</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {availableTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompts Grid/List */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">No prompts found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || filters.tags.length > 0 || filters.collectionId || filters.isFavorite !== undefined
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first prompt'
                }
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleCreateWithAI}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Create with AI</span>
                </button>
                <button
                  onClick={handleCreatePrompt}
                  className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Manually</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                collections={collections}
                onEdit={handleEditPrompt}
                onDelete={handleDeletePrompt}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
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