import React, { useState } from 'react'
import { Plus, FolderOpen, Edit, Trash2, FileText } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'
import { usePrompts } from '../hooks/usePrompts'
import { useForm } from 'react-hook-form'
import { Database } from '../lib/supabase'

type Collection = Database['public']['Tables']['collections']['Row']

interface CollectionFormData {
  name: string
  description: string
  color: string
}

const colors = [
  '#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981',
  '#6366F1', '#F97316', '#EC4899', '#84CC16', '#06B6D4', '#8B5A2B'
]

export function Collections() {
  const { collections, prompts, createCollection, updateCollection, deleteCollection } = usePrompts()
  const [showForm, setShowForm] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CollectionFormData>({
    defaultValues: {
      name: '',
      description: '',
      color: '#14B8A6'
    }
  })

  const selectedColor = watch('color')

  const handleCreateCollection = () => {
    setEditingCollection(null)
    reset({ name: '', description: '', color: '#14B8A6' })
    setShowForm(true)
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    reset({
      name: collection.name,
      description: collection.description,
      color: collection.color
    })
    setShowForm(true)
  }

  const onSubmit = async (data: CollectionFormData) => {
    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, data)
      } else {
        await createCollection(data)
      }
      setShowForm(false)
      reset()
    } catch (error) {
      console.error('Failed to save collection:', error)
    }
  }

  const handleDeleteCollection = async (id: string) => {
    if (confirm('Are you sure you want to delete this collection? Prompts in this collection will not be deleted.')) {
      await deleteCollection(id)
    }
  }

  const getCollectionPromptCount = (collectionId: string) => {
    return prompts.filter(p => p.collection_id === collectionId).length
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Collections</h1>
            <p className="text-slate-400">Organize your prompts into meaningful groups</p>
          </div>
          
          <button
            onClick={handleCreateCollection}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Collection</span>
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No collections yet</h3>
              <p className="text-slate-400 mb-6">
                Create your first collection to organize your prompts
              </p>
              <button
                onClick={handleCreateCollection}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Collection</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: collection.color }}
                    />
                    <h3 className="text-lg font-semibold text-white truncate">
                      {collection.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditCollection(collection)}
                      className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {collection.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <FileText className="w-4 h-4" />
                    <span>{getCollectionPromptCount(collection.id)} prompts</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Created {new Date(collection.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">
                  {editingCollection ? 'Edit Collection' : 'Create Collection'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="Enter collection name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                    rows={3}
                    placeholder="Describe your collection..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue('color', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-white scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingCollection ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}