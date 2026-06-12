export const trendingTopics = []
export const affiliateLinks = []
export const recentActivity = []

export const statsData = {
  today: { comments: 0, clicks: 0, conversions: 0, revenue: 0.00 },
  week: { comments: 0, clicks: 0, conversions: 0, revenue: 0.00 },
  month: { comments: 0, clicks: 0, conversions: 0, revenue: 0.00 },
}

export const ctrHistory = []
export const revenueByNiche = []

export const shadowbanRisk = {
  score: 0,
  level: 'none',
  factors: []
}

export const complianceSettings = {
  autoDisclosure: true,
  disclosureTemplate: '#Ad | {link}',
  ftcCompliant: true,
  linkShortening: true,
  shortenerService: 'bitly',
  disclosureLog: true,
  cooldownEnabled: true,
  maxCommentsPerHour: 30,
  maxCommentsPerTopic: 5,
  minDelaySeconds: 45,
  maxDelaySeconds: 180,
}
