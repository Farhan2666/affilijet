import { TrendingUp, MousePointerClick, DollarSign, MessageSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { statsData } from '../data/mockData'
import { useState } from 'react'

const statCards = [
  { key: 'comments', label: 'Comments Deployed', icon: MessageSquare, color: 'velocity-blue', change: 0 },
  { key: 'clicks', label: 'Link Clicks', icon: MousePointerClick, color: 'cash-gold', change: 0 },
  { key: 'conversions', label: 'Conversions', icon: TrendingUp, color: 'alert-green', change: 0 },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'cash-gold', change: 0, prefix: '$' },
]

const colorMap = {
  'velocity-blue': { bg: 'bg-velocity-blue/10', text: 'text-velocity-blue' },
  'cash-gold': { bg: 'bg-cash-gold/10', text: 'text-cash-gold' },
  'alert-green': { bg: 'bg-alert-green/10', text: 'text-alert-green' },
}

export default function StatsOverview() {
  const [period, setPeriod] = useState('today')
  const data = statsData[period]

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Performance Overview</h2>
        <div className="flex gap-1 bg-dark-bg rounded-lg p-0.5">
          {['today', 'week', 'month'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize
                ${period === p ? 'bg-velocity-blue text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon
          const value = data[card.key]
          const colors = colorMap[card.color]
          return (
            <div key={card.key} className="bg-dark-bg rounded-xl p-4 border border-dark-border hover:border-gray-600 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">
                {card.prefix || ''}{typeof value === 'number' && card.key === 'revenue' ? value.toFixed(2) : value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
