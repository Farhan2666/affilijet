const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

export const api = {
  trending: {
    getTopics: () => request('/trending'),
    getTopicDetails: (topic) => request(`/trending/${encodeURIComponent(topic)}`),
  },

  comments: {
    generate: (topic, linkId) => request('/comments/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, linkId })
    }),
    deploy: (topic, comment, linkId, tweetId) => request('/comments/deploy', {
      method: 'POST',
      body: JSON.stringify({ topic, comment, linkId, tweetId })
    }),
    getHistory: () => request('/comments/history'),
    getRisk: () => request('/comments/risk'),
  },

  links: {
    getAll: () => request('/links'),
    add: (link) => request('/links', {
      method: 'POST',
      body: JSON.stringify(link)
    }),
    update: (id, updates) => request(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
    delete: (id) => request(`/links/${id}`, { method: 'DELETE' }),
    importCSV: (csvData) => request('/links/import', {
      method: 'POST',
      body: JSON.stringify({ csvData })
    }),
  },

  auth: {
    twitter: {
      login: () => request('/auth/twitter'),
      disconnect: (userId) => request('/auth/twitter/disconnect', {
        method: 'POST',
        body: JSON.stringify({ userId })
      }),
    }
  }
}
