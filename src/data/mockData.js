export const trendingTopics = [
  { id: 1, topic: '#AIRevolution', tweets: '45.2K', velocity: 92, relevance: 0.94, category: 'Technology', matched: true },
  { id: 2, topic: '#SummerDeals2026', tweets: '38.7K', velocity: 87, relevance: 0.91, category: 'Shopping', matched: true },
  { id: 3, topic: '#CryptoSurge', tweets: '31.5K', velocity: 78, relevance: 0.72, category: 'Finance', matched: false },
  { id: 4, topic: '#FitLife', tweets: '28.1K', velocity: 74, relevance: 0.88, category: 'Health', matched: true },
  { id: 5, topic: '#GamingSetup', tweets: '22.8K', velocity: 69, relevance: 0.85, category: 'Gaming', matched: false },
  { id: 6, topic: '#RemoteWork', tweets: '19.4K', velocity: 63, relevance: 0.79, category: 'Career', matched: true },
  { id: 7, topic: '#SustainableLiving', tweets: '17.2K', velocity: 58, relevance: 0.82, category: 'Lifestyle', matched: false },
  { id: 8, topic: '#TechGadgets', tweets: '15.9K', velocity: 55, relevance: 0.90, category: 'Technology', matched: true },
  { id: 9, topic: '#MealPrep', tweets: '14.3K', velocity: 51, relevance: 0.86, category: 'Health', matched: true },
  { id: 10, topic: '#InvestSmart', tweets: '12.8K', velocity: 47, relevance: 0.73, category: 'Finance', matched: false },
];

export const affiliateLinks = [
  { id: 1, name: 'Amazon Tech Deals', url: 'amzn.to/tech2026', niche: 'Technology', conversions: 342, ctr: 4.2, status: 'active' },
  { id: 2, name: 'Nike Summer Sale', url: 'nk.co/summer26', niche: 'Shopping', conversions: 218, ctr: 3.8, status: 'active' },
  { id: 3, name: 'CryptoExchange Pro', url: 'cryptex.io/join', niche: 'Finance', conversions: 156, ctr: 2.9, status: 'active' },
  { id: 4, name: 'FitGear Pro', url: 'fitgear.co/pro', niche: 'Health', conversions: 289, ctr: 5.1, status: 'active' },
  { id: 5, name: 'GameStation RGB', url: 'gstat.io/rgb', niche: 'Gaming', conversions: 178, ctr: 3.5, status: 'paused' },
  { id: 6, name: 'WeWork Spaces', url: 'wework.co/space', niche: 'Career', conversions: 94, ctr: 2.1, status: 'active' },
  { id: 7, name: 'EcoStore', url: 'ecostore.co/go', niche: 'Lifestyle', conversions: 127, ctr: 3.2, status: 'active' },
  { id: 8, name: 'GadgetHub', url: 'gadgethub.io/deal', niche: 'Technology', conversions: 267, ctr: 4.7, status: 'active' },
];

export const recentActivity = [
  { id: 1, action: 'comment_deployed', topic: '#AIRevolution', link: 'Amazon Tech Deals', time: '12s ago', status: 'success', reply_to: '@techguru22' },
  { id: 2, action: 'comment_deployed', topic: '#SummerDeals2026', link: 'Nike Summer Sale', time: '34s ago', status: 'success', reply_to: '@shopholic99' },
  { id: 3, action: 'stealth_delay', topic: '#FitLife', link: 'FitGear Pro', time: '1m ago', status: 'waiting', reply_to: '@fitnesscoach' },
  { id: 4, action: 'comment_deployed', topic: '#TechGadgets', link: 'GadgetHub', time: '2m ago', status: 'success', reply_to: '@gadgetlover' },
  { id: 5, action: 'compliance_check', topic: '#RemoteWork', link: 'WeWork Spaces', time: '3m ago', status: 'success', reply_to: '@remoteworker' },
  { id: 6, action: 'shadowban_alert', topic: '#CryptoSurge', link: 'CryptoExchange Pro', time: '5m ago', status: 'warning', reply_to: '@cryptoking' },
  { id: 7, action: 'comment_deployed', topic: '#MealPrep', link: 'FitGear Pro', time: '6m ago', status: 'success', reply_to: '@mealprep_pro' },
  { id: 8, action: 'link_matched', topic: '#AIRevolution', link: 'Amazon Tech Deals', time: '7m ago', status: 'info', reply_to: '@ainews_daily' },
];

export const statsData = {
  today: { comments: 847, clicks: 234, conversions: 67, revenue: 482.50 },
  week: { comments: 5230, clicks: 1456, conversions: 389, revenue: 2847.30 },
  month: { comments: 21450, clicks: 6123, conversions: 1567, revenue: 11234.80 },
};

export const ctrHistory = [
  { time: '00:00', ctr: 2.1, comments: 12 },
  { time: '02:00', ctr: 1.8, comments: 8 },
  { time: '04:00', ctr: 1.5, comments: 5 },
  { time: '06:00', ctr: 2.4, comments: 18 },
  { time: '08:00', ctr: 3.2, comments: 45 },
  { time: '10:00', ctr: 4.1, comments: 78 },
  { time: '12:00', ctr: 4.8, comments: 102 },
  { time: '14:00', ctr: 5.2, comments: 134 },
  { time: '16:00', ctr: 4.9, comments: 121 },
  { time: '18:00', ctr: 5.5, comments: 156 },
  { time: '20:00', ctr: 4.7, comments: 98 },
  { time: '22:00', ctr: 3.8, comments: 70 },
];

export const revenueByNiche = [
  { name: 'Technology', value: 4200, color: '#2563EB' },
  { name: 'Health', value: 2800, color: '#10B981' },
  { name: 'Shopping', value: 2100, color: '#F59E0B' },
  { name: 'Gaming', value: 1200, color: '#8B5CF6' },
  { name: 'Finance', value: 934, color: '#EF4444' },
];

export const shadowbanRisk = {
  score: 12,
  level: 'low',
  factors: [
    { name: 'Comment Frequency', status: 'safe', detail: '8-15 min avg interval' },
    { name: 'Content Uniqueness', status: 'safe', detail: '94% unique variations' },
    { name: 'Link Pattern', status: 'safe', detail: 'Rotated shorteners' },
    { name: 'Account Age', status: 'safe', detail: '180+ days' },
    { name: 'Reply Ratio', status: 'warning', detail: '62% replies vs tweets' },
  ]
};

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
};
