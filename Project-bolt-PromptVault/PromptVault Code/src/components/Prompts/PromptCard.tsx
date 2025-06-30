import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Star, Edit, Trash2, Copy, ExternalLink } from 'lucide-react'
import { Database } from '../../lib/supabase'

type Prompt = Database['public']['Tables']['prompts']['Row']
type Collection = Database['public']['Tables']['collections']['Row']

interface PromptCardProps {
  prompt: Prompt
  collections: Collection[]
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  onCopy: (content: string) => void
}

export function PromptCard({ 
  prompt, 
  collections, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onCopy 
}: PromptCardProps) {
  const collection = collections.find(c => c.id === prompt.collection_id)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    onCopy(prompt.content)
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-white truncate">{prompt.title}</h3>
            {prompt.is_template && (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                Template
              </span>
            )}
          </div>
          
          {collection && (
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collection.color }}
              />
              <span className="text-sm text-slate-400">{collection.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(prompt.id, !prompt.is_favorite)}
            className={`p-2 rounded-lg transition-colors ${
              prompt.is_favorite 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-slate-400 hover:text-yellow-400'
            }`}
          >
            <Star className={`w-4 h-4 ${prompt.is_favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
        {prompt.content.slice(0, 200)}...
      </p>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
              +{prompt.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Updated {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
        </span>
        <ExternalLink className="w-4 h-4" />
      </div>
    </div>
  )
}