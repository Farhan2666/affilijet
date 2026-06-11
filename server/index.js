import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { apiRoutes } from './routes/api.js'
import { initializeFirebase } from './config/firebase.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { validateInput, helmet as customHelmet, errorSanitizer } from './middleware/security.js'
import { logAPICall } from './middleware/audit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(customHelmet)

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://affilijet.vercel.app'
    ]
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.use(logAPICall)
app.use(rateLimiter)
app.use(validateInput)

initializeFirebase()

app.use('/api', apiRoutes)

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  })
})

app.use(errorSanitizer)

const server = app.listen(PORT, () => {
  console.log(`🚀 AffiliJet Server running on port ${PORT}`)
  console.log(`🔒 Security: Helmet + Rate Limiting + Input Validation + Audit Logging`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    process.exit(0)
  })
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
