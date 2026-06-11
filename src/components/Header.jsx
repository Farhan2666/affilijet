import { Bell, Search, Wifi, AtSign } from 'lucide-react'

export default function Header({ jetMode, setJetMode }) {
  return (
    <header className="h-16 bg-dark-card/80 backdrop-blur-md border-b border-dark-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search topics, links..."
            className="bg-dark-bg border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-velocity-blue/50 w-64 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-alert-green/10 border border-alert-green/20">
          <Wifi className="w-3.5 h-3.5 text-alert-green" />
          <span className="text-xs font-medium text-alert-green">Connected</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-velocity-blue/10 border border-velocity-blue/20">
          <AtSign className="w-3.5 h-3.5 text-velocity-blue" />
          <span className="text-xs font-medium text-blue-300">@hustler_affiliate</span>
        </div>

        <button
          onClick={() => setJetMode(!jetMode)}
          className={`relative px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2
            ${jetMode
              ? 'bg-cash-gold text-gray-900 jet-active'
              : 'bg-dark-bg text-gray-400 border border-dark-border hover:border-cash-gold/50 hover:text-cash-gold'
            }`}
        >
          <span className="text-base">✈️</span>
          JET MODE
          {jetMode && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
