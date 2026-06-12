import { useState } from 'react'
import { LogIn, AtSign, Cookie } from 'lucide-react'
import { setSessionCookie } from '../utils/cookies'

export default function LoginModal({ isOpen, onClose, onLogin, onTwitterCookieLogin }) {
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
              <h2 className="text-base lg:text-lg font-bold text-white">Login to AffiliJet</h2>
              <p className="text-xs text-gray-500">Choose your login method</p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-4">
          <button
            onClick={onTwitterCookieLogin}
            className="w-full p-4 rounded-lg bg-velocity-blue/10 border border-velocity-blue/30 hover:bg-velocity-blue/20 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-velocity-blue/20 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-velocity-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Twitter Cookies</h3>
                <p className="text-xs text-gray-400">Paste your Twitter cookies for direct access</p>
              </div>
              <span className="text-xs text-velocity-blue font-medium group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-dark-card text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Demo Username</label>
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
              <p className="text-xs text-gray-500 mt-1">For testing UI only — no real Twitter access</p>
            </div>

            <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-medium border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all">
              Continue with Demo Mode
            </button>
          </form>

          <div className="p-3 rounded-lg bg-cash-gold/10 border border-cash-gold/20">
            <p className="text-xs text-gray-400">
              <strong className="text-cash-gold">Note:</strong> Twitter Cookies method gives real Twitter access. Demo mode is for UI testing only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
