import { BitlyClient } from 'bitly'

let bitlyClient = null

export function initializeBitly() {
  bitlyClient = new BitlyClient(process.env.BITLY_ACCESS_TOKEN)
  console.log('✅ Bitly initialized')
  return bitlyClient
}

export function getBitlyClient() {
  if (!bitlyClient) {
    return initializeBitly()
  }
  return bitlyClient
}

export async function shortenLink(longUrl, customBackhalf) {
  try {
    const bitly = getBitlyClient()
    
    const response = await bitly.shorten(longUrl, {
      domain: 'bit.ly',
      custom_backhalf: customBackhalf
    })
    
    return {
      shortUrl: response.link,
      id: response.id,
      longUrl: response.long_url
    }
    
  } catch (error) {
    console.error('Error shortening link:', error)
    throw new Error('Failed to shorten link with Bitly')
  }
}

export async function getLinkClicks(linkId) {
  try {
    const bitly = getBitlyClient()
    const metrics = await bitly.getBitlinkMetrics(linkId, {
      unit: 'day',
      units: 7
    })
    
    return metrics
  } catch (error) {
    console.error('Error getting link metrics:', error)
    throw new Error('Failed to get link metrics')
  }
}
