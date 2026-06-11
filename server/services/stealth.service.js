export function calculateDelay(minDelay, maxDelay) {
  const min = parseInt(minDelay) || 45
  const max = parseInt(maxDelay) || 180
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shouldDeployComment(deploymentHistory, settings) {
  const now = Date.now()
  const oneHourAgo = now - (60 * 60 * 1000)
  
  const recentDeployments = deploymentHistory.filter(d => d.timestamp > oneHourAgo)
  
  if (recentDeployments.length >= (settings.maxCommentsPerHour || 30)) {
    return { allowed: false, reason: 'Hourly limit reached' }
  }
  
  const topicDeployments = recentDeployments.filter(d => d.topic === settings.currentTopic)
  if (topicDeployments.length >= (settings.maxCommentsPerTopic || 5)) {
    return { allowed: false, reason: 'Topic limit reached' }
  }
  
  const lastDeployment = recentDeployments[recentDeployments.length - 1]
  if (lastDeployment) {
    const timeSinceLast = now - lastDeployment.timestamp
    const requiredDelay = calculateDelay(settings.minDelaySeconds, settings.maxDelaySeconds) * 1000
    
    if (timeSinceLast < requiredDelay) {
      return { 
        allowed: false, 
        reason: 'Cooldown active',
        waitTime: Math.ceil((requiredDelay - timeSinceLast) / 1000)
      }
    }
  }
  
  return { allowed: true }
}

export function generateContentVariation(baseComment) {
  const variations = [
    (text) => text,
    (text) => text.replace(/[.!?]$/, ' 🔥'),
    (text) => text.replace(/[.!?]$/, ' 👀'),
    (text) => `Honestly, ${text.charAt(0).toLowerCase()}${text.slice(1)}`,
    (text) => text.split(' ').reverse().join(' ')
  ]
  
  const randomVariation = variations[Math.floor(Math.random() * variations.length)]
  return randomVariation(baseComment)
}

export function calculateShadowbanRisk(deploymentHistory) {
  const now = Date.now()
  const last24Hours = deploymentHistory.filter(d => d.timestamp > now - (24 * 60 * 60 * 1000))
  
  let riskScore = 0
  const factors = []
  
  const avgInterval = calculateAverageInterval(last24Hours)
  if (avgInterval < 300000) {
    riskScore += 30
    factors.push({ name: 'Comment Frequency', status: 'danger', detail: `${Math.round(avgInterval / 1000)}s avg interval` })
  } else if (avgInterval < 600000) {
    riskScore += 15
    factors.push({ name: 'Comment Frequency', status: 'warning', detail: `${Math.round(avgInterval / 1000)}s avg interval` })
  } else {
    factors.push({ name: 'Comment Frequency', status: 'safe', detail: `${Math.round(avgInterval / 1000)}s avg interval` })
  }
  
  const uniqueComments = new Set(last24Hours.map(d => d.comment)).size
  const uniquenessRatio = uniqueComments / Math.max(last24Hours.length, 1)
  if (uniquenessRatio < 0.5) {
    riskScore += 25
    factors.push({ name: 'Content Uniqueness', status: 'danger', detail: `${Math.round(uniquenessRatio * 100)}% unique` })
  } else if (uniquenessRatio < 0.8) {
    riskScore += 10
    factors.push({ name: 'Content Uniqueness', status: 'warning', detail: `${Math.round(uniquenessRatio * 100)}% unique` })
  } else {
    factors.push({ name: 'Content Uniqueness', status: 'safe', detail: `${Math.round(uniquenessRatio * 100)}% unique` })
  }
  
  const linkPatterns = new Set(last24Hours.map(d => d.linkDomain)).size
  if (linkPatterns === 1 && last24Hours.length > 10) {
    riskScore += 20
    factors.push({ name: 'Link Pattern', status: 'warning', detail: 'Single domain' })
  } else {
    factors.push({ name: 'Link Pattern', status: 'safe', detail: 'Rotated domains' })
  }
  
  factors.push({ name: 'Account Age', status: 'safe', detail: '180+ days' })
  
  const replyRatio = last24Hours.filter(d => d.isReply).length / Math.max(last24Hours.length, 1)
  if (replyRatio > 0.7) {
    riskScore += 10
    factors.push({ name: 'Reply Ratio', status: 'warning', detail: `${Math.round(replyRatio * 100)}% replies` })
  } else {
    factors.push({ name: 'Reply Ratio', status: 'safe', detail: `${Math.round(replyRatio * 100)}% replies` })
  }
  
  const level = riskScore < 25 ? 'low' : riskScore < 50 ? 'medium' : riskScore < 75 ? 'high' : 'critical'
  
  return {
    score: Math.min(100, riskScore),
    level,
    factors
  }
}

function calculateAverageInterval(deployments) {
  if (deployments.length < 2) return 600000
  
  const sorted = [...deployments].sort((a, b) => a.timestamp - b.timestamp)
  let totalInterval = 0
  
  for (let i = 1; i < sorted.length; i++) {
    totalInterval += sorted[i].timestamp - sorted[i - 1].timestamp
  }
  
  return totalInterval / (sorted.length - 1)
}
