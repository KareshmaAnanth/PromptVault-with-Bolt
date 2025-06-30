import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Star, ExternalLink } from 'lucide-react'
import { Database } from '../../lib/supabase'

type Prompt = Database['public']['Tables']['prompts']['Row']

interface RecentPromptsProps {
  prompts: Prompt[]
  onSelectPrompt: (prompt: Prompt) => void
}

export function RecentPrompts({ prompts, onSelectPrompt }: RecentPromptsProps) {
  if (prompts.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-semibold text-white">Recent Prompts</h2>
        </div>
        <p className="text-slate-400">Your latest creative sparks.</p>
        <div className="mt-6 text-center">
          <p className="text-slate-500 mb-4">No recent prompts.</p>
          <a href="/prompts" className="text-teal-400 hover:text-teal-300 transition-colors">
            Create one now!
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-semibold text-white">Recent Prompts</h2>
      </div>
      <p className="text-slate-400 mb-6">Your latest creative sparks.</p>
      
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt)}
            className="group p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-white truncate">{prompt.title}</h3>
                  {prompt.is_favorite && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                  {prompt.content.slice(0, 100)}...
                </p>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>
                    {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true })}
                  </span>
                  {prompt.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {prompt.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 2 && (
                        <span className="text-slate-500">+{prompt.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}