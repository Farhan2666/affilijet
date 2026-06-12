import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

const providers = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    createClient: (apiKey) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-haiku-20241022',
    createClient: (apiKey) => new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  },
  gemini: {
    name: 'Google Gemini',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash-exp',
    createClient: (apiKey) => new GoogleGenerativeAI(apiKey)
  },
  openrouter: {
    name: 'OpenRouter',
    models: [
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mixtral-8x7b-instruct',
      'google/gemma-2-9b-it:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
      'huggingfaceh4/zephyr-7b-beta:free'
    ],
    defaultModel: 'google/gemma-2-9b-it:free',
    createClient: (apiKey) => new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true
    })
  },
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
    createClient: (apiKey) => new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1',
      dangerouslyAllowBrowser: true
    })
  },
  groq: {
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.1-70b-versatile',
    createClient: (apiKey) => new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
      dangerouslyAllowBrowser: true
    })
  }
}

export function getProviders() {
  return Object.entries(providers).map(([key, value]) => ({
    id: key,
    name: value.name,
    models: value.models,
    defaultModel: value.defaultModel
  }))
}

export function getProviderModels(providerId) {
  const provider = providers[providerId]
  if (!provider) throw new Error(`Provider ${providerId} not found`)
  return provider.models
}

export function isCustomModel(providerId, model) {
  const provider = providers[providerId]
  if (!provider) return true
  return !provider.models.includes(model)
}

export async function generateCommentBYOK(providerId, apiKey, model, topic, affiliateLink, context = '') {
  const provider = providers[providerId]
  if (!provider) throw new Error(`Provider ${providerId} not found`)

  const systemPrompt = `You are an expert social media marketer specializing in affiliate marketing on Twitter/X.
Your task is to generate engaging, natural-sounding comments that seamlessly incorporate affiliate links.

Rules:
- Keep comments under 280 characters (Twitter limit)
- Make it sound authentic, not salesy
- Include relevant emojis sparingly (1-2 max)
- Naturally weave in the product/service benefit
- Match the tone of the trending topic
- Never use spammy language like "CLICK HERE" or "BUY NOW"
- Add value to the conversation first, then mention the link

Return ONLY valid JSON array, no markdown, no code blocks, just the raw JSON array.`

  const userPrompt = `Generate a Twitter comment for the trending topic: "${topic}"

Context: ${context || 'General trending topic'}
Affiliate link to include: ${affiliateLink.url}
Product/Service: ${affiliateLink.name}
Niche: ${affiliateLink.niche}

Generate 3 variations with different angles. Return as JSON array:
[
  { "variation": "personal", "text": "comment text" },
  { "variation": "problem-solution", "text": "comment text" },
  { "variation": "curiosity", "text": "comment text" }
]`

  try {
    let response
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

    if (providerId === 'gemini') {
      const client = provider.createClient(apiKey)
      const generativeModel = client.getGenerativeModel({ model })
      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      })
      response = result.response.text()
    } else if (providerId === 'anthropic') {
      const client = provider.createClient(apiKey)
      const result = await client.messages.create({
        model,
        max_tokens: 500,
        messages: [{ role: 'user', content: fullPrompt }]
      })
      response = result.content[0].text
    } else {
      const client = provider.createClient(apiKey)
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.8,
        max_tokens: 500
      })
      response = completion.choices[0].message.content
    }

    response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const parsed = JSON.parse(response)
    const variations = Array.isArray(parsed) ? parsed : parsed.comments || parsed.variations || []
    
    if (!variations.length) {
      throw new Error('No variations generated')
    }
    
    return {
      variations,
      provider: provider.name,
      model,
      confidence: calculateConfidence(topic, affiliateLink)
    }
    
  } catch (error) {
    console.error('Error generating comment:', error)
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error('Invalid API key. Please check your key in settings.')
    }
    if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    }
    if (error.message.includes('404')) {
      throw new Error(`Model "${model}" not found. Please check the model name.`)
    }
    
    throw new Error(`Failed to generate: ${error.message}`)
  }
}

function calculateConfidence(topic, affiliateLink) {
  const topicLower = topic.toLowerCase()
  const nicheLower = affiliateLink.niche.toLowerCase()
  
  let score = 0.5
  
  if (topicLower.includes(nicheLower) || nicheLower.includes(topicLower.replace('#', ''))) {
    score += 0.3
  }
  
  const keywords = affiliateLink.name.toLowerCase().split(' ')
  const matchCount = keywords.filter(k => topicLower.includes(k) && k.length > 3).length
  score += (matchCount / keywords.length) * 0.2
  
  return Math.min(0.99, score)
}
