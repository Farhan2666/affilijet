import { useState } from 'react'
import { LogIn, Cookie, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react'
import { setTwitterCookies, getTwitterCookies, clearTwitterCookies } from '../utils/twitterCookies'

export default function TwitterCookieLogin({ isOpen, onClose, onLogin }) {
  const [cookieString, setCookieString] = useState('')
  const [showCookie, setShowCookie] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    if (!cookieString.trim()) {
      setError('Please paste your Twitter cookies')
      return
    }

    if (!cookieString.includes('auth_token=') || !cookieString.includes('ct0=')) {
      setError('Invalid cookie format. Must contain auth_token and ct0')
      return
    }

    try {
      setTwitterCookies(cookieString)
      setSuccess(true)
      setTimeout(() => {
        onLogin?.({ provider: 'twitter-cookies', username: 'twitter_user' })
        onClose()
      }, 1500)
    } catch (err) {
      setError('Failed to save cookies: ' + err.message)
    }
  }

  const handleClear = () => {
    clearTwitterCookies()
    setCookieString('')
    setSuccess(false)
    setError('')
  }

  useState(() => {
    const existing = getTwitterCookies()
    if (existing) {
      setCookieString(existing)
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg">
        <div className="p-4 lg:p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-velocity-blue/10 flex items-center justify-center">
              <Cookie className="w-4 h-4 lg:w-5 lg:h-5 text-velocity-blue" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-white">Twitter Cookie Login</h2>
              <p className="text-xs text-gray-500">Paste your Twitter cookies below</p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-400">
                <strong>SECURITY WARNING:</strong> Never share your cookies publicly. Only paste them here in your private browser. Cookies are stored locally and never sent to any server.
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-alert-green/10 border border-alert-green/20 flex items-center gap-2">
              <Check className="w-4 h-4 text-alert-green" />
              <span className="text-sm text-alert-green">Cookies saved successfully!</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Twitter Cookies</label>
            <div className="relative">
              <textarea
                value={cookieString}
                onChange={(e) => { setCookieString(e.target.value); setError('') }}
                placeholder="Paste your Twitter cookies here (e.g., auth_token=xxx; ct0=xxx; ...)"
                className={`w-full bg-dark-bg border rounded-lg p-3 text-xs font-mono resize-none focus:outline-none focus:border-velocity-blue/50 min-h-[120px] ${
                  showCookie ? 'text-white' : 'text-transparent'
                } border-dark-border`}
                style={!showCookie ? { caretColor: 'white' } : {}}
              />
              <button
                type="button"
                onClick={() => setShowCookie(!showCookie)}
                className="absolute top-3 right-3 p-1.5 rounded bg-dark-card hover:bg-dark-border transition-colors"
              >
                {showCookie ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Get cookies from Twitter.com → DevTools (F12) → Application → Cookies
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-primary text-sm"
            >
              Save Cookies
            </button>
          </div>

          <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
            <p className="text-xs text-gray-400">
              <strong className="text-white">How to get cookies:</strong>
            </p>
            <ol className="text-xs text-gray-500 mt-2 space-y-1 list-decimal list-inside">
              <li>Login to Twitter.com in your browser</li>
              <li>Press F12 to open DevTools</li>
              <li>Go to Application tab → Cookies → twitter.com</li>
              <li>Copy all cookies as a single string (name=value; name2=value2)</li>
              <li>Paste above and save</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
