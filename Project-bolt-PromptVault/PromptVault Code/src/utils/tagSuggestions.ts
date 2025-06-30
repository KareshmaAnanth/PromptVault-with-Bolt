// Mock AI-driven tag suggestions
const commonTags = [
  'creative writing', 'marketing', 'social media', 'email', 'blog',
  'copywriting', 'technical writing', 'documentation', 'brainstorming',
  'ideas', 'productivity', 'automation', 'analysis', 'research',
  'strategy', 'planning', 'presentation', 'meeting', 'summary',
  'review', 'feedback', 'improvement', 'optimization', 'seo',
  'content creation', 'video script', 'podcast', 'interview',
  'tutorial', 'guide', 'how-to', 'tips', 'best practices',
  'case study', 'report', 'proposal', 'pitch', 'sales'
]

const categoryKeywords = {
  marketing: ['sell', 'promote', 'campaign', 'audience', 'brand', 'conversion', 'lead'],
  creative: ['story', 'narrative', 'character', 'plot', 'creative', 'imagine', 'write'],
  technical: ['code', 'development', 'api', 'database', 'system', 'software', 'tech'],
  business: ['meeting', 'proposal', 'strategy', 'analysis', 'report', 'presentation'],
  content: ['blog', 'article', 'post', 'content', 'publish', 'share', 'social'],
  education: ['learn', 'teach', 'explain', 'tutorial', 'guide', 'how-to', 'step']
}

export function generateTagSuggestions(content: string): string[] {
  const suggestions = new Set<string>()
  const lowerContent = content.toLowerCase()
  
  // Add category-based suggestions
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      suggestions.add(category)
    }
  })
  
  // Add common tags that match content
  commonTags.forEach(tag => {
    const tagWords = tag.split(' ')
    if (tagWords.some(word => lowerContent.includes(word))) {
      suggestions.add(tag)
    }
  })
  
  // Limit to 5 suggestions
  return Array.from(suggestions).slice(0, 5)
}

export function getAllTags(): string[] {
  return [...new Set([...commonTags, ...Object.keys(categoryKeywords)])]
}