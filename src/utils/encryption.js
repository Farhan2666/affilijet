export function encryptAPIKey(apiKey) {
  if (!apiKey) return ''
  
  try {
    const encoded = btoa(unescape(encodeURIComponent(apiKey)))
    return `enc_${encoded}`
  } catch (error) {
    console.error('Encryption failed:', error)
    return ''
  }
}

export function decryptAPIKey(encryptedKey) {
  if (!encryptedKey) return ''
  
  try {
    if (!encryptedKey.startsWith('enc_')) {
      return encryptedKey
    }
    
    const encoded = encryptedKey.substring(4)
    return decodeURIComponent(escape(atob(encoded)))
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

export function saveAPIKey(providerId, apiKey, model) {
  const encrypted = encryptAPIKey(apiKey)
  const data = {
    apiKey: encrypted,
    model,
    updatedAt: new Date().toISOString(),
    providerId
  }
  
  try {
    localStorage.setItem(`affilijet_apikey_${providerId}`, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save API key:', error)
    return false
  }
}

export function getAPIKey(providerId) {
  const stored = localStorage.getItem(`affilijet_apikey_${providerId}`)
  if (!stored) return null
  
  try {
    const data = JSON.parse(stored)
    const decryptedKey = decryptAPIKey(data.apiKey)
    
    if (!decryptedKey) {
      removeAPIKey(providerId)
      return null
    }
    
    return {
      apiKey: decryptedKey,
      model: data.model,
      updatedAt: data.updatedAt,
      providerId: data.providerId || providerId
    }
  } catch (error) {
    console.error('Failed to parse API key data:', error)
    removeAPIKey(providerId)
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

export function testAPIKey(providerId, apiKey) {
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{20,}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-]+$/,
    gemini: /^[a-zA-Z0-9_-]{30,}$/,
    openrouter: /^sk-or-[a-zA-Z0-9-]{40,}$/,
    deepseek: /^sk-[a-zA-Z0-9]{20,}$/,
    groq: /^gsk_[a-zA-Z0-9]{20,}$/
  }
  
  const pattern = patterns[providerId]
  if (!pattern) return { valid: true, message: 'Format check skipped' }
  
  if (!pattern.test(apiKey)) {
    return { 
      valid: false, 
      message: `Invalid format for ${providerId}. Expected pattern: ${pattern.source}` 
    }
  }
  
  return { valid: true, message: 'Format looks good' }
}
