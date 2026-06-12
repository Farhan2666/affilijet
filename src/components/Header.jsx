import { Bell, Search, Wifi, AtSign, Key, Check, LogOut, User, Menu } from 'lucide-react'
import { getAllAPIKeys } from '../utils/encryption'
import { useState, useEffect } from 'react'

export default function Header({ jetMode, setJetMode, onOpenBYOK, user, onLoginClick, onLogout }) {
  const [keyCount, setKeyCount] = useState(0)

  useEffect(() => {
    const keys = getAllAPIKeys()
    setKeyCount(Object.keys(keys).length)
  }, [])

  return (
    <header className="h-16 lg:h-16 bg-dark-card/80 backdrop-blur-md border-b border-dark-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="hidden lg:flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-dark-bg border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-velocity-blue/50 w-48 lg:w-64 transition-colors"
          />
        </div>
      </div>

      <div className="lg:hidden flex-1 pl-12">
        <h1 className="text-sm font-bold text-white">AffiliJet</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={onOpenBYOK}
          className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 rounded-lg border transition-all text-xs ${
            keyCount > 0
              ? 'bg-alert-green/10 border-alert-green/20 text-alert-green'
              : 'bg-cash-gold/10 border-cash-gold/20 text-cash-gold'
          }`}
        >
          {keyCount > 0 ? (
            <>
              <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline font-medium">{keyCount} AI {keyCount === 1 ? 'Key' : 'Keys'}</span>
              <span className="sm:hidden font-medium">{keyCount}</span>
            </>
          ) : (
            <>
              <Key className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <span className="hidden sm:inline font-medium">Setup AI</span>
              <span className="sm:hidden font-medium">AI</span>
            </>
          )}
        </button>

        {user ? (
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-lg bg-velocity-blue/10 border border-velocity-blue/20">
              <AtSign className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-velocity-blue" />
              <span className="text-xs font-medium text-blue-300">@{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 lg:p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 rounded-lg bg-velocity-blue/10 border border-velocity-blue/20 text-velocity-blue hover:bg-velocity-blue/20 transition-all text-xs"
          >
            <User className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
            <span className="hidden sm:inline font-medium">Login</span>
          </button>
        )}

        <button
          onClick={() => setJetMode(!jetMode)}
          className={`relative px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold text-xs lg:text-sm transition-all duration-300 flex items-center gap-1.5 lg:gap-2
            ${jetMode
              ? 'bg-cash-gold text-gray-900 jet-active'
              : 'bg-dark-bg text-gray-400 border border-dark-border hover:border-cash-gold/50 hover:text-cash-gold'
            }`}
        >
          <span className="text-sm lg:text-base">✈️</span>
          <span className="hidden sm:inline">JET</span>
          {jetMode && (
            <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        <button className="relative p-1.5 lg:p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
