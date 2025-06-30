import React, { useState } from 'react'
import { Sparkles, ArrowRight, Copy, Save, X, Lightbulb, Wand2 } from 'lucide-react'

interface AIPromptBuilderProps {
  onSave: (enhancedPrompt: string, title: string) => void
  onClose: () => void
}

// Mock AI enhancement function - in production this would call an AI API
const enhancePrompt = (simplePrompt: string): string => {
  const enhancements = {
    'write a blog post': `Write a comprehensive blog post about [TOPIC]. Structure it as follows:

**Introduction:**
- Hook the reader with an engaging opening
- Clearly state the problem or topic
- Preview what they'll learn

**Main Content:**
- Break into 3-5 clear sections with subheadings
- Include practical examples and actionable tips
- Use bullet points for easy scanning
- Add relevant statistics or data where appropriate

**Conclusion:**
- Summarize key takeaways
- Include a clear call-to-action
- Encourage reader engagement

**Style Guidelines:**
- Tone: [Professional/Conversational/Authoritative]
- Target audience: [Define your audience]
- Word count: [Specify length]
- Include relevant keywords for SEO

Make it engaging, informative, and actionable for readers.`,

    'create social media content': `Create engaging social media content for [PLATFORM] about [TOPIC]. Include:

**Content Structure:**
- Attention-grabbing hook in the first line
- Clear value proposition or main message
- Call-to-action that encourages engagement

**Platform-Specific Optimization:**
- Instagram: Visual-first with compelling caption and relevant hashtags
- LinkedIn: Professional tone with industry insights
- Twitter: Concise, conversation-starting content
- Facebook: Community-building focus with questions

**Engagement Elements:**
- Ask a question to spark discussion
- Include relevant trending hashtags (3-5 for Instagram, 1-2 for LinkedIn)
- Use emojis strategically for visual appeal
- Add a clear call-to-action (like, share, comment, visit link)

**Content Variations:**
- Create 3 different versions for A/B testing
- Adapt tone for different audience segments
- Include both educational and promotional content

Target audience: [Define demographics and interests]
Brand voice: [Describe your brand personality]`,

    'write an email': `Compose a professional email for [PURPOSE]. Structure:

**Subject Line:**
- Clear, specific, and action-oriented
- Under 50 characters for mobile optimization
- Create urgency or curiosity when appropriate

**Email Body:**
- Personal greeting using recipient's name
- Clear opening that states the purpose
- Concise body with key information organized in short paragraphs
- Specific call-to-action with clear next steps
- Professional closing with contact information

**Tone and Style:**
- Match the relationship level (formal/informal)
- Be direct but courteous
- Use active voice and clear language
- Keep paragraphs short for easy reading

**Follow-up Strategy:**
- Include timeline for response if needed
- Mention when you'll follow up if no response
- Provide alternative contact methods if urgent

Recipient: [Define who you're writing to]
Context: [Explain the situation or background]
Desired outcome: [What do you want to achieve]`,

    'create a presentation': `Develop a compelling presentation on [TOPIC] with the following structure:

**Slide Structure:**
1. **Title Slide:** Clear title, your name, date, and context
2. **Agenda/Overview:** What you'll cover and key takeaways
3. **Problem/Opportunity:** Define the challenge or opportunity
4. **Solution/Approach:** Your main content organized in 3-5 key points
5. **Evidence/Examples:** Data, case studies, or demonstrations
6. **Next Steps/Action Items:** Clear outcomes and responsibilities
7. **Q&A/Discussion:** Encourage engagement

**Design Guidelines:**
- Maximum 6 bullet points per slide
- Use high-quality visuals and minimal text
- Consistent color scheme and fonts
- Include slide numbers and your branding

**Delivery Tips:**
- Practice transitions between slides
- Prepare for potential questions
- Have backup slides for deep-dive topics
- Include interactive elements when possible

**Audience Considerations:**
- Tailor complexity to audience expertise
- Address their specific concerns and interests
- Use relevant examples and case studies
- Consider cultural and professional context

Duration: [Specify presentation length]
Audience: [Define who will be attending]
Objective: [What you want to achieve]`,

    'analyze data': `Conduct a comprehensive data analysis for [DATASET/TOPIC]. Follow this framework:

**Data Preparation:**
- Define the research questions and hypotheses
- Identify key metrics and variables to examine
- Clean and validate the data for accuracy
- Document data sources and collection methods

**Analysis Framework:**
- Descriptive statistics: means, medians, distributions
- Trend analysis: patterns over time
- Comparative analysis: segments, cohorts, or groups
- Correlation analysis: relationships between variables
- Statistical significance testing where appropriate

**Visualization Strategy:**
- Choose appropriate chart types for each insight
- Create clear, labeled visualizations
- Use consistent color coding and formatting
- Include data tables for detailed reference

**Insights and Interpretation:**
- Identify key findings and patterns
- Explain what the data means in business context
- Highlight unexpected or counterintuitive results
- Discuss limitations and potential biases

**Recommendations:**
- Provide actionable insights based on findings
- Prioritize recommendations by impact and feasibility
- Include next steps for implementation
- Suggest areas for further investigation

Context: [Explain the business situation]
Stakeholders: [Who will use these insights]
Timeline: [When results are needed]`
  }

  // Find the best matching enhancement
  const lowerPrompt = simplePrompt.toLowerCase()
  for (const [key, enhancement] of Object.entries(enhancements)) {
    if (lowerPrompt.includes(key.split(' ')[0]) || lowerPrompt.includes(key)) {
      return enhancement
    }
  }

  // Default enhancement for any prompt
  return `Create detailed content about: "${simplePrompt}"

**Objective:**
- Clearly define what you want to achieve
- Specify the target audience and their needs
- Outline the desired outcome or action

**Content Structure:**
- Introduction: Hook and context setting
- Main body: Organized into logical sections
- Conclusion: Summary and next steps

**Key Requirements:**
- Tone: [Specify: professional, casual, authoritative, friendly]
- Length: [Define word count or time limit]
- Format: [Specify: article, script, outline, etc.]
- Audience: [Define demographics, expertise level, interests]

**Quality Guidelines:**
- Use clear, engaging language
- Include specific examples and details
- Ensure logical flow and transitions
- Add relevant data or statistics if applicable
- Include actionable takeaways

**Additional Considerations:**
- Brand voice and messaging consistency
- SEO optimization (if applicable)
- Call-to-action or next steps
- Potential objections or questions to address

Please customize the bracketed sections with your specific requirements.`
}

export function AIPromptBuilder({ onSave, onClose }: AIPromptBuilderProps) {
  const [simplePrompt, setSimplePrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)

  const handleEnhance = async () => {
    if (!simplePrompt.trim()) return

    setIsEnhancing(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const enhanced = enhancePrompt(simplePrompt)
    setEnhancedPrompt(enhanced)
    setShowEnhanced(true)
    setIsEnhancing(false)

    // Auto-generate title
    const words = simplePrompt.split(' ').slice(0, 4).join(' ')
    setTitle(`AI Enhanced: ${words.charAt(0).toUpperCase() + words.slice(1)}`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt)
  }

  const handleSave = () => {
    if (enhancedPrompt && title) {
      onSave(enhancedPrompt, title)
    }
  }

  const quickPrompts = [
    "Write a blog post about productivity",
    "Create social media content for product launch",
    "Write an email to potential clients",
    "Create a presentation for quarterly review",
    "Analyze customer feedback data"
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Prompt Builder</h2>
              <p className="text-slate-400 text-sm">Transform simple ideas into powerful prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Describe what you want to create
                </label>
                <textarea
                  value={simplePrompt}
                  onChange={(e) => setSimplePrompt(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                  placeholder="e.g., 'Write a blog post about productivity tips' or 'Create social media content for my new product'"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Quick Start Ideas:</h3>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setSimplePrompt(prompt)}
                      className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEnhance}
                disabled={!simplePrompt.trim() || isEnhancing}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-6 py-3 rounded-lg transition-all"
              >
                {isEnhancing ? (
                  <>
                    <Wand2 className="w-5 h-5 animate-spin" />
                    <span>Enhancing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Enhance with AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              {showEnhanced ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Enhanced Prompt Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter a title for your enhanced prompt"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-300">
                        AI-Enhanced Prompt
                      </label>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="h-80 p-4 bg-slate-700 border border-slate-600 rounded-lg overflow-auto">
                      <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                        {enhancedPrompt}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => setShowEnhanced(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!enhancedPrompt || !title}
                      className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Enhanced Prompt</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Enhancement Ready</h3>
                    <p className="text-slate-400 text-sm">
                      Enter your simple prompt idea and let AI transform it into a detailed, effective prompt
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}