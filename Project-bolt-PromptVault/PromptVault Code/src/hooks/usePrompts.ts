import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './useAuth'

type Prompt = Database['public']['Tables']['prompts']['Row']
type Collection = Database['public']['Tables']['collections']['Row']

interface UsePromptsReturn {
  prompts: Prompt[]
  collections: Collection[]
  loading: boolean
  error: string | null
  createPrompt: (prompt: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updatePrompt: (id: string, updates: Partial<Prompt>) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  createCollection: (collection: Omit<Collection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
  searchPrompts: (query: string, filters?: { tags?: string[], collectionId?: string, isFavorite?: boolean }) => Prompt[]
  recentPrompts: Prompt[]
  favoritePrompts: Prompt[]
  refreshData: () => Promise<void>
}

// Demo data for showcase
const demoCollections: Collection[] = [
  {
    id: 'col-1',
    user_id: 'demo-user-123',
    name: 'Marketing Copy',
    description: 'Prompts for creating compelling marketing content',
    color: '#3B82F6',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'col-2',
    user_id: 'demo-user-123',
    name: 'Creative Writing',
    description: 'Story ideas and creative writing prompts',
    color: '#8B5CF6',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  },
  {
    id: 'col-3',
    user_id: 'demo-user-123',
    name: 'Technical Documentation',
    description: 'Prompts for technical writing and documentation',
    color: '#10B981',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z'
  }
]

const demoPrompts: Prompt[] = [
  {
    id: 'prompt-1',
    user_id: 'demo-user-123',
    collection_id: 'col-1',
    title: 'Product Launch Email',
    content: 'Write a compelling product launch email for [PRODUCT NAME] that highlights the key benefits and creates urgency. Include:\n\n- Attention-grabbing subject line\n- Personal greeting\n- Problem/solution narrative\n- Key features and benefits\n- Social proof or testimonials\n- Clear call-to-action\n- Limited-time offer\n\nTone: Professional yet conversational\nTarget audience: [DESCRIBE AUDIENCE]',
    output: 'Subject: 🚀 Finally Here: [PRODUCT NAME] is Live (Limited Time Bonus Inside)\n\nHi [NAME],\n\nAfter months of development and testing, I\'m thrilled to announce that [PRODUCT NAME] is officially available!\n\nYou know that frustrating feeling when [PROBLEM]? We built [PRODUCT NAME] specifically to solve this...',
    tags: ['marketing', 'email', 'product-launch', 'copywriting'],
    is_favorite: true,
    is_template: true,
    created_at: '2024-01-20T16:45:00Z',
    updated_at: '2024-01-22T11:30:00Z'
  },
  {
    id: 'prompt-2',
    user_id: 'demo-user-123',
    collection_id: 'col-2',
    title: 'Character Development Worksheet',
    content: 'Create a detailed character profile for a protagonist in a [GENRE] story. Include:\n\n**Basic Information:**\n- Name, age, occupation\n- Physical appearance\n- Background and upbringing\n\n**Personality:**\n- Core traits and quirks\n- Fears and motivations\n- Speech patterns\n\n**Story Arc:**\n- Initial state\n- Character growth\n- Final transformation\n\n**Relationships:**\n- Key relationships\n- Conflicts with other characters\n- Support system',
    output: '',
    tags: ['creative-writing', 'character-development', 'storytelling'],
    is_favorite: false,
    is_template: true,
    created_at: '2024-01-18T09:20:00Z',
    updated_at: '2024-01-18T09:20:00Z'
  },
  {
    id: 'prompt-3',
    user_id: 'demo-user-123',
    collection_id: 'col-1',
    title: 'Social Media Content Calendar',
    content: 'Create a 30-day social media content calendar for [BRAND/BUSINESS]. Include:\n\n**Content Mix:**\n- Educational posts (40%)\n- Behind-the-scenes (20%)\n- User-generated content (20%)\n- Promotional content (20%)\n\n**Platform-specific adaptations:**\n- Instagram: Visual-first with engaging captions\n- LinkedIn: Professional insights and industry news\n- Twitter: Quick tips and conversation starters\n- Facebook: Community-building content\n\n**Engagement strategies:**\n- Questions to spark discussion\n- Trending hashtags\n- Call-to-action phrases\n- Best posting times',
    output: 'Week 1 Content Calendar:\n\nMonday - Educational Post\n"5 Common Mistakes in [INDUSTRY] and How to Avoid Them"\nPlatforms: LinkedIn, Facebook\nHashtags: #MondayMotivation #IndustryTips\n\nTuesday - Behind the Scenes\n"Coffee chat with our team about upcoming projects"\nPlatforms: Instagram Stories, Twitter\nHashtags: #TeamTuesday #BehindTheScenes...',
    tags: ['social-media', 'content-calendar', 'marketing', 'planning'],
    is_favorite: true,
    is_template: false,
    created_at: '2024-01-19T14:15:00Z',
    updated_at: '2024-01-21T16:45:00Z'
  },
  {
    id: 'prompt-4',
    user_id: 'demo-user-123',
    collection_id: 'col-3',
    title: 'API Documentation Template',
    content: 'Create comprehensive API documentation for [API NAME]. Structure:\n\n**Overview:**\n- Purpose and functionality\n- Authentication requirements\n- Base URL and versioning\n\n**Endpoints:**\nFor each endpoint include:\n- HTTP method and URL\n- Description\n- Parameters (required/optional)\n- Request examples\n- Response examples\n- Error codes and messages\n\n**Getting Started:**\n- Quick start guide\n- Code examples in multiple languages\n- Common use cases\n\n**Additional Resources:**\n- Rate limiting information\n- SDKs and libraries\n- Support contact',
    output: '',
    tags: ['technical-writing', 'api', 'documentation', 'development'],
    is_favorite: false,
    is_template: true,
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: 'prompt-5',
    user_id: 'demo-user-123',
    collection_id: 'col-2',
    title: 'Short Story Idea Generator',
    content: 'Generate a unique short story concept using these elements:\n\n**Setting:** [Choose: futuristic city, small town, space station, underwater colony, post-apocalyptic wasteland]\n\n**Main Character:** A [profession] who has a secret ability to [supernatural power]\n\n**Conflict:** They must [action] before [time limit] or [consequence]\n\n**Twist:** The antagonist is actually [unexpected relationship]\n\n**Theme:** Explore the concept of [abstract concept like trust, identity, sacrifice]\n\n**Tone:** [Choose: mysterious, humorous, dark, hopeful, surreal]\n\nDevelop this into a 2-3 sentence story premise that could be expanded into a 1000-word short story.',
    output: 'Story Concept:\n\nIn a underwater research colony, marine biologist Dr. Sarah Chen discovers she can communicate telepathically with deep-sea creatures. When the colony\'s life support systems begin failing, she must convince a massive, ancient creature to help save her crew before their oxygen runs out in 6 hours. The twist: the creature is actually her presumed-dead research partner who was transformed in a previous experiment, and she must choose between saving the colony or helping him return to human form.',
    tags: ['creative-writing', 'story-ideas', 'fiction', 'brainstorming'],
    is_favorite: true,
    is_template: false,
    created_at: '2024-01-21T13:30:00Z',
    updated_at: '2024-01-21T18:45:00Z'
  },
  {
    id: 'prompt-6',
    user_id: 'demo-user-123',
    collection_id: null,
    title: 'Meeting Summary Template',
    content: 'Summarize the key points from [MEETING TYPE] held on [DATE]. Include:\n\n**Meeting Details:**\n- Date, time, duration\n- Attendees\n- Meeting purpose\n\n**Key Discussion Points:**\n- Main topics covered\n- Decisions made\n- Concerns raised\n\n**Action Items:**\n- Task description\n- Assigned person\n- Due date\n- Priority level\n\n**Next Steps:**\n- Follow-up meetings\n- Deadlines to track\n- Dependencies\n\n**Additional Notes:**\n- Important quotes or insights\n- Resources mentioned\n- Parking lot items for future discussion',
    output: '',
    tags: ['productivity', 'meetings', 'business', 'organization'],
    is_favorite: false,
    is_template: true,
    created_at: '2024-01-17T10:45:00Z',
    updated_at: '2024-01-17T10:45:00Z'
  }
]

export function usePrompts(): UsePromptsReturn {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>(demoPrompts)
  const [collections, setCollections] = useState<Collection[]>(demoCollections)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    // In demo mode, we use static data
    // In production, this would fetch from Supabase
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const createPrompt = async (promptData: Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    const newPrompt: Prompt = {
      ...promptData,
      id: `prompt-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setPrompts(prev => [newPrompt, ...prev])
  }

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === id 
        ? { ...prompt, ...updates, updated_at: new Date().toISOString() }
        : prompt
    ))
  }

  const deletePrompt = async (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id))
  }

  const createCollection = async (collectionData: Omit<Collection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    const newCollection: Collection = {
      ...collectionData,
      id: `col-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setCollections(prev => [newCollection, ...prev])
  }

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(collection => 
      collection.id === id 
        ? { ...collection, ...updates, updated_at: new Date().toISOString() }
        : collection
    ))
  }

  const deleteCollection = async (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id))
  }

  const searchPrompts = (query: string, filters?: { tags?: string[], collectionId?: string, isFavorite?: boolean }) => {
    return prompts.filter(prompt => {
      const matchesQuery = !query || 
        prompt.title.toLowerCase().includes(query.toLowerCase()) ||
        prompt.content.toLowerCase().includes(query.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => prompt.tags.includes(tag))

      const matchesCollection = !filters?.collectionId || 
        prompt.collection_id === filters.collectionId

      const matchesFavorite = filters?.isFavorite === undefined || 
        prompt.is_favorite === filters.isFavorite

      return matchesQuery && matchesTags && matchesCollection && matchesFavorite
    })
  }

  const recentPrompts = prompts
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const favoritePrompts = prompts.filter(p => p.is_favorite)

  return {
    prompts,
    collections,
    loading,
    error,
    createPrompt,
    updatePrompt,
    deletePrompt,
    createCollection,
    updateCollection,
    deleteCollection,
    searchPrompts,
    recentPrompts,
    favoritePrompts,
    refreshData: fetchData,
  }
}