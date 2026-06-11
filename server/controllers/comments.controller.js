import { generateComment, analyzeTopicRelevance } from '../services/openai.service.js'
import { shortenLink } from '../services/bitly.service.js'
import { shouldDeployComment, generateContentVariation, calculateShadowbanRisk } from '../services/stealth.service.js'
import { getTwitterClient } from '../config/twitter.js'
import { getDb } from '../config/firebase.js'

export async function generateCommentForTopic(req, res) {
  try {
    const { topic, linkId } = req.body
    
    const db = getDb()
    const linkDoc = await db.collection('affiliate_links').doc(linkId).get()
    
    if (!linkDoc.exists) {
      return res.status(404).json({ success: false, error: 'Affiliate link not found' })
    }
    
    const affiliateLink = { id: linkDoc.id, ...linkDoc.data() }
    
    let shortUrl = affiliateLink.url
    if (affiliateLink.shortenLinks) {
      const shortened = await shortenLink(affiliateLink.url)
      shortUrl = shortened.shortUrl
    }
    
    const linkWithShortUrl = { ...affiliateLink, url: shortUrl }
    const result = await generateComment(topic, linkWithShortUrl)
    
    await db.collection('generated_comments').add({
      topic,
      linkId,
      variations: result.variations,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      status: 'generated'
    })
    
    res.json({
      success: true,
      data: {
        variations: result.variations,
        confidence: result.confidence,
        link: {
          id: affiliateLink.id,
          name: affiliateLink.name,
          url: shortUrl
        }
      }
    })
    
  } catch (error) {
    console.error('Error in generateCommentForTopic:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function deployComment(req, res) {
  try {
    const { topic, comment, linkId, tweetId } = req.body
    
    const db = getDb()
    
    const deploymentHistorySnap = await db.collection('deployment_history')
      .where('timestamp', '>', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .get()
    
    const deploymentHistory = deploymentHistorySnap.docs.map(doc => doc.data())
    
    const settings = {
      maxCommentsPerHour: 30,
      maxCommentsPerTopic: 5,
      minDelaySeconds: 45,
      maxDelaySeconds: 180,
      currentTopic: topic
    }
    
    const check = shouldDeployComment(deploymentHistory, settings)
    if (!check.allowed) {
      return res.status(429).json({
        success: false,
        error: check.reason,
        waitTime: check.waitTime
      })
    }
    
    const twitterClient = getTwitterClient()
    const variedComment = generateContentVariation(comment)
    
    let deploymentResult
    if (tweetId) {
      deploymentResult = await twitterClient.v2.reply(variedComment, tweetId)
    } else {
      deploymentResult = await twitterClient.v2.tweet(variedComment)
    }
    
    const linkDoc = await db.collection('affiliate_links').doc(linkId).get()
    const linkData = linkDoc.data()
    
    await db.collection('deployment_history').add({
      topic,
      comment: variedComment,
      linkId,
      linkDomain: new URL(linkData.url).hostname,
      tweetId: deploymentResult.data?.id,
      timestamp: Date.now(),
      status: 'deployed',
      isReply: !!tweetId
    })
    
    const risk = calculateShadowbanRisk([...deploymentHistory, {
      topic,
      comment: variedComment,
      timestamp: Date.now(),
      linkDomain: new URL(linkData.url).hostname
    }])
    
    res.json({
      success: true,
      data: {
        tweetId: deploymentResult.data?.id,
        comment: variedComment,
        deployedAt: new Date().toISOString(),
        shadowbanRisk: risk
      }
    })
    
  } catch (error) {
    console.error('Error in deployComment:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function getDeploymentHistory(req, res) {
  try {
    const db = getDb()
    const snapshot = await db.collection('deployment_history')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get()
    
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    res.json({
      success: true,
      data: history
    })
    
  } catch (error) {
    console.error('Error in getDeploymentHistory:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function getShadowbanRisk(req, res) {
  try {
    const db = getDb()
    const snapshot = await db.collection('deployment_history')
      .where('timestamp', '>', Date.now() - (24 * 60 * 60 * 1000))
      .get()
    
    const history = snapshot.docs.map(doc => doc.data())
    const risk = calculateShadowbanRisk(history)
    
    res.json({
      success: true,
      data: risk
    })
    
  } catch (error) {
    console.error('Error in getShadowbanRisk:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
