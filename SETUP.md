# AffiliJet - Fullstack Setup Guide

## Prerequisites

Kamu perlu akun dan API keys dari:

### 1. Twitter API v2
- Daftar di https://developer.twitter.com
- Buat project dan app
- Dapatkan: API Key, API Secret, Bearer Token
- Setup callback URL: `http://localhost:3001/api/auth/twitter/callback`

### 2. OpenAI API
- Daftar di https://platform.openai.com
- Buat API key di https://platform.openai.com/api-keys
- Minimum credit $5 untuk testing

### 3. Bitly API
- Daftar di https://bitly.com
- Get access token di https://app.bitly.com/settings/api/

### 4. Firebase
- Buat project di https://console.firebase.google.com
- Enable Firestore Database
- Download service account key: Project Settings > Service Accounts > Generate New Private Key
- Rename file jadi `serviceAccountKey.json` dan taruh di `server/config/`
- Copy database URL dari Firestore settings

## Installation

```bash
# Install dependencies
npm install

# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan isi semua API keys
nano .env (atau text editor favorit)
```

## Running the App

```bash
# Run frontend + backend bersamaan
npm run dev:all

# Atau run terpisah:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Environment Variables

Edit file `.env`:

```env
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_BEARER_TOKEN=xxx
TWITTER_CALLBACK_URL=http://localhost:3001/api/auth/twitter/callback

OPENAI_API_KEY=sk-xxx

BITLY_ACCESS_TOKEN=xxx

FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

FRONTEND_URL=http://localhost:5173
PORT=3001
```

## Deployment

### Backend (Vercel/Railway/Render)
- Upload semua file kecuali `node_modules` dan `.env`
- Set environment variables di platform deployment
- Upload `serviceAccountKey.json` secara manual atau via platform secrets

### Frontend (Vercel)
- Sudah ter-deploy di https://affilijet.vercel.app
- Update `VITE_API_URL` di Vercel environment variables ke backend URL

## API Endpoints

### Trending
- `GET /api/trending` - Fetch trending topics dari Twitter
- `GET /api/trending/:topic` - Detail tweets untuk topik tertentu

### Comments
- `POST /api/comments/generate` - Generate komentar AI untuk topik
- `POST /api/comments/deploy` - Deploy komentar ke Twitter
- `GET /api/comments/history` - Riwayat deployment
- `GET /api/comments/risk` - Shadowban risk score

### Links
- `GET /api/links` - List semua affiliate links
- `POST /api/links` - Tambah link baru
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Hapus link
- `POST /api/links/import` - Import links dari CSV

### Auth
- `GET /api/auth/twitter` - Initiate Twitter OAuth
- `GET /api/auth/twitter/callback` - OAuth callback
- `POST /api/auth/twitter/disconnect` - Disconnect Twitter

## Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS 3
- Recharts (charts)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- Firebase Admin SDK (Firestore)
- Twitter API v2
- OpenAI API (GPT-4o-mini)
- Bitly API

## Security Notes

- Jangan commit `.env` atau `serviceAccountKey.json` ke Git
- Semua file sensitive sudah ada di `.gitignore`
- Rotate API keys secara berkala
- Monitor usage di masing-masing platform

## Troubleshooting

**Twitter API Error 403:**
- Pastikan app permission sudah "Read and Write"
- Check kalau Bearer Token sudah benar

**OpenAI Rate Limit:**
- Upgrade ke paid tier atau tunggu 1 menit
- Check usage di https://platform.openai.com/usage

**Firebase Permission Denied:**
- Check Firestore security rules
- Pastikan service account key valid

## Support

Untuk pertanyaan atau issue, buka issue di GitHub repository.
