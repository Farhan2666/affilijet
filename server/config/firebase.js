import admin from 'firebase-admin'
import serviceAccount from '../config/serviceAccountKey.json' assert { type: 'json' }

let db = null

export function initializeFirebase() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    })
    console.log('✅ Firebase initialized')
  }
  db = admin.firestore()
  return db
}

export function getDb() {
  if (!db) {
    return initializeFirebase()
  }
  return db
}

export { admin }
