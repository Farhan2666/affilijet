import { getOpenAIClient } from '../config/openai.js'

export async function generateComment(topic, affiliateLink, context = '') {
  const openai = getOpenAIClient()
  
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content)
    
    return {
      variations: response.comments || response,
      model: "gpt-4o-mini",
      tokens_used: completion.usage.total_tokens,
      confidence: calculateConfidence(topic, affiliateLink)
    }
    
  } catch (error) {
    console.error('Error generating comment:', error)
    throw new Error('Failed to generate comment with OpenAI')
  }
}

function calculateConfidence(topic, affiliateLink) {
  const topicLower = topic.toLowerCase()
  const nicheLower = affiliateLink.niche.toLowerCase()
  const nameLower = affiliateLink.name.toLowerCase()
  
  let score = 0.5
  
  if (topicLower.includes(nicheLower) || nicheLower.includes(topicLower.replace('#', ''))) {
    score += 0.3
  }
  
  const keywords = affiliateLink.name.toLowerCase().split(' ')
  const matchCount = keywords.filter(k => topicLower.includes(k)).length
  score += (matchCount / keywords.length) * 0.2
  
  return Math.min(0.99, score)
}

export async function analyzeTopicRelevance(topic, affiliateLinks) {
  const openai = getOpenAIClient()
  
  const prompt = `Analyze the relevance of these affiliate links to the trending topic "${topic}".

Affiliate links:
${affiliateLinks.map((link, i) => `${i + 1}. ${link.name} (${link.niche}) - ${link.url}`).join('\n')}

For each link, rate relevance from 0.0 to 1.0 and explain why.
Return as JSON: { "rankings": [{ "link_id": 1, "relevance": 0.85, "reason": "brief explanation" }] }`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert at matching affiliate products to social media conversations." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    return JSON.parse(completion.choices[0].message.content)
    
  } catch (error) {
    console.error('Error analyzing relevance:', error)
    throw new Error('Failed to analyze topic relevance')
  }
}
