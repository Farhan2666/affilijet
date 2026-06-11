import { getDb } from '../config/firebase.js'

export async function auditLog(action, details, userId = 'anonymous') {
  try {
    const db = getDb()
    
    await db.collection('audit_logs').add({
      action,
      details,
      userId,
      timestamp: new Date().toISOString(),
      ip: 'masked',
      userAgent: 'masked'
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}

export function logAPICall(req, res, next) {
  const start = Date.now()
  
  res.on('finish', async () => {
    const duration = Date.now() - start
    
    await auditLog('api_call', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    })
  })
  
  next()
}

export async function logSecurityEvent(eventType, details) {
  await auditLog('security_event', {
    type: eventType,
    ...details
  })
}
