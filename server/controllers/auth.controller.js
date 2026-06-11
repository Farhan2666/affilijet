import { getAuthLink, initializeTwitter } from '../config/twitter.js'
import { getDb } from '../config/firebase.js'

export async function initiateTwitterAuth(req, res) {
  try {
    const authLink = getAuthLink()
    
    const db = getDb()
    await db.collection('auth_states').doc(authLink.oauth_token).set({
      oauth_token_secret: authLink.oauth_token_secret,
      createdAt: new Date().toISOString()
    })
    
    res.json({
      success: true,
      data: {
        authUrl: authLink.url,
        oauthToken: authLink.oauth_token
      }
    })
    
  } catch (error) {
    console.error('Error in initiateTwitterAuth:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function handleTwitterCallback(req, res) {
  try {
    const { oauth_token, oauth_verifier } = req.query
    
    const db = getDb()
    const stateDoc = await db.collection('auth_states').doc(oauth_token).get()
    
    if (!stateDoc.exists) {
      return res.status(400).json({ success: false, error: 'Invalid OAuth token' })
    }
    
    const stateData = stateDoc.data()
    
    const TwitterApi = (await import('twitter-api-v2')).TwitterApi
    const requestClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: oauth_token,
      accessSecret: stateData.oauth_token_secret
    })
    
    const { client: loggedClient, accessToken, accessSecret } = await requestClient.login(oauth_verifier)
    
    const user = await loggedClient.v2.me()
    
    initializeTwitter(accessToken, accessSecret)
    
    await db.collection('users').doc(user.data.id).set({
      twitterId: user.data.id,
      username: user.data.username,
      name: user.data.name,
      accessToken,
      accessSecret,
      connectedAt: new Date().toISOString()
    })
    
    await db.collection('auth_states').doc(oauth_token).delete()
    
    res.json({
      success: true,
      data: {
        user: user.data,
        accessToken,
        accessSecret
      }
    })
    
  } catch (error) {
    console.error('Error in handleTwitterCallback:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export async function disconnectTwitter(req, res) {
  try {
    const { userId } = req.body
    
    const db = getDb()
    await db.collection('users').doc(userId).update({
      accessToken: null,
      accessSecret: null,
      disconnectedAt: new Date().toISOString()
    })
    
    res.json({
      success: true,
      message: 'Twitter disconnected successfully'
    })
    
  } catch (error) {
    console.error('Error in disconnectTwitter:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
