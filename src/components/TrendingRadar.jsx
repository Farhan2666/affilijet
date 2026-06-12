import { useState, useEffect } from 'react'
import { Radar, Zap, ChevronRight, Inbox, RefreshCw } from 'lucide-react'

function VelocityBar({ value }) {
  const color = value > 80 ? 'bg-red-500' : value > 60 ? 'bg-cash-gold' : 'bg-velocity-blue'
  return (
    <div className="w-12 lg:w-16 h-1.5 bg-dark-bg rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  )
}

function RelevanceBadge({ score }) {
  const pct = Math.round(score * 100)
  const color = score > 0.85 ? 'text-alert-green bg-alert-green/10' : score > 0.7 ? 'text-cash-gold bg-cash-gold/10' : 'text-gray-400 bg-gray-500/10'
  return (
    <span className={`text-[10px] lg:text-xs font-semibold px-1 lg:px-1.5 py-0.5 rounded ${color}`}>{pct}%</span>
  )
}

export default function TrendingRadar({ onDeploy }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchTrending = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/trending')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      if (data.success) {
        setTopics(data.data)
        setLastUpdate(new Date())
      }
    } catch (err) {
      setError('Could not connect to Twitter API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrending() }, [])

  const sorted = [...topics].sort((a, b) => b.velocity - a.velocity)

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-dark-border">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="relative w-7 h-7 lg:w-8 lg:h-8">
            <div className="absolute inset-0 rounded-full bg-velocity-blue/20" />
            <div className="absolute inset-0.5 lg:inset-1 rounded-full radar-sweep-anim" style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(37,99,235,0.4) 15%, transparent 30%)' }} />
            <Radar className="absolute inset-0 m-auto w-3 h-3 lg:w-4 lg:h-4 text-velocity-blue" />
          </div>
          <div>
            <h3 className="text-xs lg:text-sm font-semibold text-white">AI Trend Radar</h3>
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="badge-live text-[10px]">LOADING</span>
              ) : topics.length > 0 ? (
                <span className="badge-live text-[10px]">LIVE</span>
              ) : (
                <span className="text-[10px] text-gray-500">No data</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={fetchTrending} disabled={loading} className="p-1.5 lg:p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 lg:p-4 border-b border-dark-border">
          <div className="p-2 lg:p-3 rounded-lg bg-cash-gold/10 border border-cash-gold/20">
            <p className="text-xs text-cash-gold">{error}</p>
            <p className="text-[10px] text-gray-500 mt-1">Check backend configuration</p>
          </div>
        </div>
      )}

      <div className="max-h-[300px] lg:max-h-[400px] overflow-y-auto">
        {sorted.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-center">
            <Inbox className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600 mb-2 lg:mb-3" />
            <p className="text-xs lg:text-sm text-gray-400 mb-1">No trending topics</p>
            <p className="text-[10px] lg:text-xs text-gray-600">Click refresh to fetch</p>
          </div>
        ) : (
          sorted.map((topic, i) => (
            <div key={topic.id || i} className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 border-b border-dark-border/50 hover:bg-white/[0.02] transition-all">
              <span className="text-[10px] lg:text-xs text-gray-600 w-4 lg:w-5 text-right font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <span className="text-xs lg:text-sm font-medium text-white truncate">{topic.topic}</span>
                  {topic.matched && <Zap className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-cash-gold flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2 lg:gap-3 mt-0.5 lg:mt-1">
                  <span className="text-[10px] lg:text-xs text-gray-500">{topic.tweets}</span>
                  <span className="text-[10px] lg:text-xs text-stealth-gray">{topic.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <VelocityBar value={topic.velocity} />
                <RelevanceBadge score={topic.relevance} />
                {topic.matched && (
                  <button onClick={() => onDeploy?.(topic)} className="p-1 lg:p-1.5 rounded-lg bg-cash-gold/10 text-cash-gold hover:bg-cash-gold/20 transition-all">
                    <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
