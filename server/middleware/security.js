export function validateInput(req, res, next) {
  const sanitized = {}
  
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else {
      sanitized[key] = value
    }
  }
  
  req.body = sanitized
  next()
}

function sanitizeString(str) {
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .substring(0, 10000)
}

export function validateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key']
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    })
  }
  
  if (apiKey.length < 20 || apiKey.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Invalid API key format'
    })
  }
  
  req.apiKey = apiKey
  next()
}

export function helmet(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  next()
}

export function errorSanitizer(err, req, res, next) {
  const safeError = {
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    code: err.code || 'INTERNAL_ERROR'
  }
  
  console.error('[Error]', {
    path: req.path,
    method: req.method,
    error: err.message,
    timestamp: new Date().toISOString()
  })
  
  res.status(err.status || 500).json({
    success: false,
    error: safeError
  })
}
