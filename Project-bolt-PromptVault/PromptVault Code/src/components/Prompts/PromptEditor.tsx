import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, Star, Tag, Folder, Lightbulb, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Database } from '../../lib/supabase'
import { generateTagSuggestions } from '../../utils/tagSuggestions'
import { AIPromptBuilder } from './AIPromptBuilder'

type Prompt = Database['public']['Tables']['prompts']['Row']
type Collection = Database['public']['Tables']['collections']['Row']

interface PromptEditorProps {
  prompt?: Prompt
  collections: Collection[]
  onSave: (data: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
}

interface FormData {
  title: string
  content: string
  output: string
  collection_id: string
  tags: string[]
  is_favorite: boolean
  is_template: boolean
}

export function PromptEditor({ prompt, collections, onSave, onClose }: PromptEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [showAIBuilder, setShowAIBuilder] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: prompt?.title || '',
      content: prompt?.content || '',
      output: prompt?.output || '',
      collection_id: prompt?.collection_id || '',
      tags: prompt?.tags || [],
      is_favorite: prompt?.is_favorite || false,
      is_template: prompt?.is_template || false,
    }
  })

  const watchedContent = watch('content')
  const watchedTags = watch('tags')

  useEffect(() => {
    if (watchedContent) {
      const suggestions = generateTagSuggestions(watchedContent)
      setSuggestedTags(suggestions.filter(tag => !watchedTags.includes(tag)))
    }
  }, [watchedContent, watchedTags])

  const addTag = (tag: string) => {
    if (tag && !watchedTags.includes(tag)) {
      setValue('tags', [...watchedTags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput.trim())
    }
  }

  const handleAIEnhancement = (enhancedPrompt: string, title: string) => {
    setValue('content', enhancedPrompt)
    setValue('title', title)
    setShowAIBuilder(false)
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      await onSave({
        title: data.title,
        content: data.content,
        output: data.output,
        collection_id: data.collection_id || null,
        tags: data.tags,
        is_favorite: data.is_favorite,
        is_template: data.is_template,
      })
      onClose()
    } catch (error) {
      console.error('Failed to save prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              {prompt ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
            <div className="flex items-center space-x-2">
              {!prompt && (
                <button
                  onClick={() => setShowAIBuilder(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Builder</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="Enter prompt title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Collection
                  </label>
                  <div className="relative">
                    <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                      {...register('collection_id')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">No collection</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Content
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsPreview(!isPreview)}
                      className="px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                    >
                      {isPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                </div>
                
                {isPreview ? (
                  <div className="w-full h-64 p-4 bg-slate-700 border border-slate-600 rounded-lg overflow-auto">
                    <ReactMarkdown className="prose prose-slate prose-invert max-w-none">
                      {watchedContent || 'Nothing to preview...'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    className="w-full h-64 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                    placeholder="Enter your prompt content (Markdown supported)"
                  />
                )}
                {errors.content && (
                  <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Output/Results (Optional)
                </label>
                <textarea
                  {...register('output')}
                  className="w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                  placeholder="Store the output or results from this prompt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {watchedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-teal-600/20 text-teal-400 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-teal-400 hover:text-teal-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="Add tags..."
                    />
                  </div>

                  {suggestedTags.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-400">Suggested tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addTag(tag)}
                            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 hover:text-white transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('is_favorite')}
                    className="w-4 h-4 text-teal-600 bg-slate-700 border-slate-600 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300">Favorite</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('is_template')}
                    className="w-4 h-4 text-teal-600 bg-slate-700 border-slate-600 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-slate-300">Template</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Prompt'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAIBuilder && (
        <AIPromptBuilder
          onSave={handleAIEnhancement}
          onClose={() => setShowAIBuilder(false)}
        />
      )}
    </>
  )
}