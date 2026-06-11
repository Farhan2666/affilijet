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
      'mistralai/mixtral-8x7b-instruct'
    ],
    defaultModel: 'openai/gpt-4o',
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

Example good comment: "This is exactly what I needed! Been using this for 3 months and the results are insane 🔥 Here's the one I got: {link}"

Example bad comment: "BUY THIS NOW!!! BEST DEAL EVER!!! {link} {link} {link}"`

  const userPrompt = `Generate a Twitter comment for the trending topic: "${topic}"

Context: ${context || 'General trending topic'}
Affiliate link to include: ${affiliateLink.url}
Product/Service: ${affiliateLink.name}
Niche: ${affiliateLink.niche}

Generate 3 variations of the comment, each with a different angle:
1. Personal experience angle
2. Problem-solution angle  
3. Curiosity/recommendation angle

Return as JSON array with format:
[
  { "variation": "personal", "text": "comment text here" },
  { "variation": "problem-solution", "text": "comment text here" },
  { "variation": "curiosity", "text": "comment text here" }
]`

  try {
    let response

    if (providerId === 'gemini') {
      const client = provider.createClient(apiKey)
      const generativeModel = client.getGenerativeModel({ model })
      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
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
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
      response = result.content[0].text
    } else {
      const client = provider.createClient(apiKey)
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
      response = completion.choices[0].message.content
    }

    const parsed = JSON.parse(response)
    
    return {
      variations: parsed.comments || parsed,
      provider: provider.name,
      model,
      confidence: calculateConfidence(topic, affiliateLink)
    }
    
  } catch (error) {
    console.error('Error generating comment with BYOK:', error)
    throw new Error(`Failed to generate comment: ${error.message}`)
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
  const matchCount = keywords.filter(k => topicLower.includes(k)).length
  score += (matchCount / keywords.length) * 0.2
  
  return Math.min(0.99, score)
}
