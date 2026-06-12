import { TrendingUp, MousePointerClick, DollarSign, MessageSquare } from 'lucide-react'
import { statsData } from '../data/mockData'
import { useState } from 'react'

const statCards = [
  { key: 'comments', label: 'Comments', icon: MessageSquare, color: 'velocity-blue' },
  { key: 'clicks', label: 'Clicks', icon: MousePointerClick, color: 'cash-gold' },
  { key: 'conversions', label: 'Conversions', icon: TrendingUp, color: 'alert-green' },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'cash-gold', prefix: '$' },
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
    <div className="card p-3 lg:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wider">Performance</h2>
        <div className="flex gap-1 bg-dark-bg rounded-lg p-0.5">
          {['today', 'week', 'month'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 lg:px-3 py-1 rounded-md text-xs font-medium transition-all capitalize
                ${period === p ? 'bg-velocity-blue text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map(card => {
          const Icon = card.icon
          const value = data[card.key]
          const colors = colorMap[card.color]
          return (
            <div key={card.key} className="bg-dark-bg rounded-xl p-3 lg:p-4 border border-dark-border hover:border-gray-600 transition-all">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                  <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${colors.text}`} />
                </div>
              </div>
              <div className="text-lg lg:text-2xl font-bold text-white mb-0.5">
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
