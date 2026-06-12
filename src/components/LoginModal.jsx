import { useState } from 'react'
import { LogIn, AtSign } from 'lucide-react'
import { setSessionCookie } from '../utils/cookies'

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    
    if (!username.startsWith('@')) {
      setError('Username must start with @')
      return
    }
    
    const session = setSessionCookie({
      userId: Date.now().toString(),
      username: username.replace('@', ''),
      provider: 'twitter'
    })
    
    onLogin?.(session)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
        <div className="p-4 lg:p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-velocity-blue/10 flex items-center justify-center">
              <LogIn className="w-4 h-4 lg:w-5 lg:h-5 text-velocity-blue" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-white">Connect Twitter</h2>
              <p className="text-xs text-gray-500">Login to start deploying</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-4 lg:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Twitter Username</label>
            <div className="relative">
              <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                placeholder="@yourusername"
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-velocity-blue/50"
                autoFocus
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cash-gold/10 border border-cash-gold/20">
            <p className="text-xs text-gray-400">
              <strong className="text-cash-gold">Note:</strong> Session cookie for local use. For production, use Twitter OAuth.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary text-sm">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
