const TWITTER_COOKIES_KEY = 'affilijet_twitter_cookies'

export function setTwitterCookies(cookieString) {
  if (!cookieString || typeof cookieString !== 'string') {
    throw new Error('Invalid cookie string')
  }

  const required = ['auth_token', 'ct0']
  for (const key of required) {
    if (!cookieString.includes(`${key}=`)) {
      throw new Error(`Missing required cookie: ${key}`)
    }
  }

  const encrypted = btoa(encodeURIComponent(cookieString))
  localStorage.setItem(TWITTER_COOKIES_KEY, encrypted)
  
  return true
}

export function getTwitterCookies() {
  const stored = localStorage.getItem(TWITTER_COOKIES_KEY)
  if (!stored) return null

  try {
    const decrypted = decodeURIComponent(atob(stored))
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt Twitter cookies:', error)
    clearTwitterCookies()
    return null
  }
}

export function clearTwitterCookies() {
  localStorage.removeItem(TWITTER_COOKIES_KEY)
}

export function hasTwitterCookies() {
  return getTwitterCookies() !== null
}

export function parseCookies(cookieString) {
  const cookies = {}
  const pairs = cookieString.split(';')
  
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.trim().split('=')
    if (name && valueParts.length > 0) {
      cookies[name.trim()] = valueParts.join('=').trim()
    }
  }
  
  return cookies
}

export function getAuthToken() {
  const cookies = getTwitterCookies()
  if (!cookies) return null
  
  const parsed = parseCookies(cookies)
  return parsed.auth_token || null
}

export function getCsrfToken() {
  const cookies = getTwitterCookies()
  if (!cookies) return null
  
  const parsed = parseCookies(cookies)
  return parsed.ct0 || null
}

export function getCookieHeader() {
  const cookies = getTwitterCookies()
  if (!cookies) return null
  
  return cookies
}
