import { getReadOnlyClient } from '../config/twitter.js'

export async function fetchTrendingTopics() {
  try {
    const client = getReadOnlyClient()
    
    const searchResults = await client.v2.search('(trending OR viral) -is:retweet', {
      max_results: 50,
      'tweet.fields': ['created_at', 'public_metrics', 'entities', 'context_annotations'],
      expansions: ['author_id'],
      'user.fields': ['public_metrics']
    })

    const topics = []
    const tweetMap = new Map()

    for (const tweet of searchResults.data.data || []) {
      const entities = tweet.entities?.hashtags || []
      
      for (const hashtag of entities) {
        const tag = hashtag.tag
        if (!tweetMap.has(tag)) {
          tweetMap.set(tag, {
            id: tag,
            topic: `#${tag}`,
            tweets: 0,
            velocity: 0,
            relevance: 0,
            category: categorizeTopic(tag, tweet.context_annotations),
            matched: false,
            sample_tweets: []
          })
        }
        
        const topicData = tweetMap.get(tag)
        topicData.tweets++
        topicData.sample_tweets.push({
          id: tweet.id,
          text: tweet.text.substring(0, 100),
          metrics: tweet.public_metrics
        })
      }
    }

    for (const [tag, data] of tweetMap) {
      const totalLikes = data.sample_tweets.reduce((sum, t) => sum + (t.metrics?.like_count || 0), 0)
      data.velocity = Math.min(99, Math.round((data.tweets * 10 + totalLikes) / 50))
      data.relevance = Math.min(0.99, (data.tweets / 20) * 0.3 + (totalLikes / 1000) * 0.7)
      data.tweets = `${(data.tweets * 2.3).toFixed(1)}K`
    }

    topics.push(...tweetMap.values())
    
    return topics
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 20)
      
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    throw new Error('Failed to fetch trending topics from Twitter API')
  }
}

function categorizeTopic(tag, contextAnnotations) {
  const techKeywords = ['ai', 'tech', 'code', 'dev', 'app', 'software', 'crypto', 'bitcoin']
  const healthKeywords = ['fit', 'health', 'gym', 'workout', 'diet', 'meal']
  const shoppingKeywords = ['sale', 'deal', 'discount', 'shop', 'buy', 'offer']
  const gamingKeywords = ['game', 'gaming', 'play', 'xbox', 'ps5', 'nintendo']
  const financeKeywords = ['invest', 'money', 'finance', 'stock', 'trading']

  const lower = tag.toLowerCase()
  
  if (techKeywords.some(k => lower.includes(k))) return 'Technology'
  if (healthKeywords.some(k => lower.includes(k))) return 'Health'
  if (shoppingKeywords.some(k => lower.includes(k))) return 'Shopping'
  if (gamingKeywords.some(k => lower.includes(k))) return 'Gaming'
  if (financeKeywords.some(k => lower.includes(k))) return 'Finance'
  
  return 'General'
}

export async function searchTweetsByTopic(topic, maxResults = 10) {
  try {
    const client = getReadOnlyClient()
    const results = await client.v2.search(topic, {
      max_results: maxResults,
      'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
      expansions: ['author_id'],
      'user.fields': ['username', 'name', 'profile_image_url']
    })
    
    return results.data
  } catch (error) {
    console.error('Error searching tweets:', error)
    throw new Error('Failed to search tweets')
  }
}
