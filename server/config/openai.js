import OpenAI from 'openai'

let openaiClient = null

export function initializeOpenAI() {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  console.log('✅ OpenAI initialized')
  return openaiClient
}

export function getOpenAIClient() {
  if (!openaiClient) {
    return initializeOpenAI()
  }
  return openaiClient
}
