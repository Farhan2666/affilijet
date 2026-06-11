const ENCRYPTION_KEY = 'affilijet-secure-key-2026'

export function encryptAPIKey(apiKey) {
  if (!apiKey) return ''
  
  let encrypted = ''
  for (let i = 0; i < apiKey.length; i++) {
    const charCode = apiKey.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    encrypted += String.fromCharCode(charCode)
  }
  
  return btoa(encrypted)
}

export function decryptAPIKey(encryptedKey) {
  if (!encryptedKey) return ''
  
  try {
    const decoded = atob(encryptedKey)
    let decrypted = ''
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      decrypted += String.fromCharCode(charCode)
    }
    
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt API key:', error)
    return ''
  }
}

export function saveAPIKey(providerId, apiKey, model) {
  const encrypted = encryptAPIKey(apiKey)
  const data = {
    apiKey: encrypted,
    model,
    updatedAt: new Date().toISOString()
  }
  
  localStorage.setItem(`affilijet_apikey_${providerId}`, JSON.stringify(data))
}

export function getAPIKey(providerId) {
  const stored = localStorage.getItem(`affilijet_apikey_${providerId}`)
  if (!stored) return null
  
  try {
    const data = JSON.parse(stored)
    return {
      apiKey: decryptAPIKey(data.apiKey),
      model: data.model,
      updatedAt: data.updatedAt
    }
  } catch (error) {
    console.error('Failed to parse API key data:', error)
    return null
  }
}

export function removeAPIKey(providerId) {
  localStorage.removeItem(`affilijet_apikey_${providerId}`)
}

export function getAllAPIKeys() {
  const keys = {}
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('affilijet_apikey_')) {
      const providerId = key.replace('affilijet_apikey_', '')
      const data = getAPIKey(providerId)
      if (data) {
        keys[providerId] = {
          ...data,
          apiKey: '••••••••' + data.apiKey.slice(-4)
        }
      }
    }
  }
  
  return keys
}

export function validateAPIKeyFormat(providerId, apiKey) {
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-]+$/,
    gemini: /^[a-zA-Z0-9_-]{39}$/,
    openrouter: /^sk-or-[a-zA-Z0-9]{40,}$/,
    deepseek: /^sk-[a-zA-Z0-9]{48}$/,
    groq: /^gsk_[a-zA-Z0-9]{40,}$/
  }
  
  const pattern = patterns[providerId]
  if (!pattern) return true
  
  return pattern.test(apiKey)
}
