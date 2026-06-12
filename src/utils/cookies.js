const COOKIE_NAME = 'affilijet_session'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60

export function setSessionCookie(userData) {
  const data = {
    userId: userData.userId || userData.id,
    username: userData.username,
    provider: userData.provider || 'twitter',
    loggedInAt: new Date().toISOString()
  }
  
  const encoded = btoa(JSON.stringify(data))
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString()
  
  document.cookie = `${COOKIE_NAME}=${encoded}; expires=${expires}; path=/; SameSite=Strict; Secure`
  
  localStorage.setItem('affilijet_user', JSON.stringify(data))
  
  return data
}

export function getSessionCookie() {
  const cookies = document.cookie.split(';')
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === COOKIE_NAME) {
      try {
        const decoded = JSON.parse(atob(value))
        return decoded
      } catch (e) {
        return null
      }
    }
  }
  
  return null
}

export function clearSessionCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  localStorage.removeItem('affilijet_user')
}

export function isLoggedIn() {
  return getSessionCookie() !== null
}

export function getCurrentUser() {
  const session = getSessionCookie()
  if (!session) {
    const stored = localStorage.getItem('affilijet_user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return null
      }
    }
  }
  return session
}

export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${btoa(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Strict; Secure`
}

export function getCookie(name) {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      try {
        return JSON.parse(atob(cookieValue))
      } catch (e) {
        return null
      }
    }
  }
  return null
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
