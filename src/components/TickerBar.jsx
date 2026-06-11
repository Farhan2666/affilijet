import { TrendingUp } from 'lucide-react'
import { trendingTopics } from '../data/mockData'

export default function TickerBar() {
  const items = [...trendingTopics, ...trendingTopics]

  return (
    <div className="bg-dark-card/50 border-b border-dark-border overflow-hidden h-8 flex items-center">
      <div className="flex items-center gap-1 px-3 h-full bg-velocity-blue/10 border-r border-dark-border flex-shrink-0">
        <TrendingUp className="w-3 h-3 text-velocity-blue" />
        <span className="text-[10px] font-bold text-velocity-blue uppercase tracking-wider">Trending</span>
      </div>
      <div className="flex overflow-hidden flex-1">
        <div className="flex items-center gap-6 ticker-scroll whitespace-nowrap">
          {items.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className={`font-medium ${t.matched ? 'text-cash-gold' : 'text-gray-400'}`}>{t.topic}</span>
              <span className="text-gray-600">{t.tweets}</span>
              <span className="text-gray-700">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
