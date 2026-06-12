import { TrendingUp } from 'lucide-react'

export default function TickerBar() {
  return (
    <div className="bg-dark-card/50 border-b border-dark-border overflow-hidden h-8 flex items-center">
      <div className="flex items-center gap-1 px-3 h-full bg-velocity-blue/10 border-r border-dark-border flex-shrink-0">
        <TrendingUp className="w-3 h-3 text-velocity-blue" />
        <span className="text-[10px] font-bold text-velocity-blue uppercase tracking-wider">Live</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xs text-gray-500">Connect Twitter API to see live trending topics</span>
      </div>
    </div>
  )
}
