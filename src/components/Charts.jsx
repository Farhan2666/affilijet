import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { TrendingUp, DollarSign } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Charts() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cash-gold/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-cash-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">CTR & Deployment</h3>
            <p className="text-xs text-gray-500">No data yet — start deploying comments</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
          Chart will appear after first deployment
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-alert-green/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-alert-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Revenue by Niche</h3>
            <p className="text-xs text-gray-500">No data yet — connect affiliate links</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
          Revenue data will appear here
        </div>
      </div>
    </div>
  )
}
