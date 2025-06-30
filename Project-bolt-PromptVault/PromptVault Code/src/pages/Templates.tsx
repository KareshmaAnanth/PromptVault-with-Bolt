import React from 'react'
import { BookTemplate as Template, Copy, Star } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'
import { usePrompts } from '../hooks/usePrompts'

export function Templates() {
  const { prompts } = usePrompts()
  const templates = prompts.filter(p => p.is_template)

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content)
    // Add toast notification here
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Templates</h1>
          <p className="text-slate-400">Reusable prompt templates to get you started quickly</p>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <Template className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No templates yet</h3>
              <p className="text-slate-400 mb-6">
                Create prompts and mark them as templates to see them here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {template.title}
                      </h3>
                      {template.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Template className="w-4 h-4 text-purple-400" />
                      <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                        Template
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyTemplate(template.content)}
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {template.content.slice(0, 150)}...
                </p>

                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleCopyTemplate(template.content)}
                    className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Use Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}