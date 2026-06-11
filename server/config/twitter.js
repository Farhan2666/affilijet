import { TwitterApi } from 'twitter-api-v2'

let twitterClient = null
let twitterReadOnlyClient = null

export function initializeTwitter(accessToken, accessSecret) {
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: accessToken,
    accessSecret: accessSecret
  })
  
  twitterReadOnlyClient = new TwitterApi(
    process.env.TWITTER_BEARER_TOKEN
  ).readOnly
  
  return twitterClient
}

export function getTwitterClient() {
  return twitterClient
}

export function getReadOnlyClient() {
  return twitterReadOnlyClient
}

export function getAuthLink() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET
  })
  
  return client.generateAuthLink(process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/api/auth/twitter/callback', {
    authAccessType: 'write',
    linkMode: 'authenticate',
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
  })
}
