import { fetchTrendingTopics, searchTweetsByTopic } from '../services/twitter.service.js'
import { getDb } from '../config/firebase.js'

export async function getTrendingTopics(req, res) {
  try {
    const topics = await fetchTrendingTopics()
    
    const db = getDb()
    const linksSnapshot = await db.collection('affiliate_links')
      .where('status', '==', 'active')
      .get()
    
    const affiliateLinks = linksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    const topicsWithMatches = topics.map(topic => {
      const matchedLink = findMatchingLink(topic, affiliateLinks)
      return {
        ...topic,
        matched: !!matchedLink,
        matchedLinkId: matchedLink?.id || null
      }
    })
    
    await db.collection('trending_snapshots').add({
      topics: topicsWithMatches,
      timestamp: new Date().toISOString(),
      count: topicsWithMatches.length
    })
    
    res.json({
      success: true,
      data: topicsWithMatches,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in getTrendingTopics:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

function findMatchingLink(topic, affiliateLinks) {
  const topicLower = topic.topic.toLowerCase()
  const categoryLower = topic.category.toLowerCase()
  
  for (const link of affiliateLinks) {
    const nicheLower = link.niche.toLowerCase()
    const nameLower = link.name.toLowerCase()
    
    if (nicheLower === categoryLower) {
      return link
    }
    
    const nameKeywords = nameLower.split(' ')
    const matchCount = nameKeywords.filter(k => topicLower.includes(k) && k.length > 3).length
    if (matchCount >= 2) {
      return link
    }
  }
  
  return null
}

export async function getTopicDetails(req, res) {
  try {
    const { topic } = req.params
    const tweets = await searchTweetsByTopic(topic, 20)
    
    res.json({
      success: true,
      data: {
        topic,
        tweets: tweets.data || [],
        includes: tweets.includes || {},
        meta: tweets.meta || {}
      }
    })
    
  } catch (error) {
    console.error('Error in getTopicDetails:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
