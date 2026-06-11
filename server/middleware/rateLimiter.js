const requestCounts = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 100

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown'
  const now = Date.now()
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, startTime: now })
    return next()
  }
  
  const userData = requestCounts.get(ip)
  
  if (now - userData.startTime > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, startTime: now })
    return next()
  }
  
  if (userData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((userData.startTime + WINDOW_MS - now) / 1000)
    })
  }
  
  userData.count++
  return next()
}

export function cleanupRateLimiter() {
  const now = Date.now()
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.startTime > WINDOW_MS) {
      requestCounts.delete(ip)
    }
  }
}

setInterval(cleanupRateLimiter, 5 * 60 * 1000)
