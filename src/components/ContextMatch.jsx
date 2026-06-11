import { useState } from 'react'
import { Sparkles, Link2, RefreshCw, Check, X, Send } from 'lucide-react'
import { trendingTopics, affiliateLinks } from '../data/mockData'

const aiSuggestions = [
  {
    topic: '#AIRevolution',
    comment: "This is exactly why I switched to AI-powered tools for my workflow. The productivity boost is insane - here's the setup I use (game changer for automating repetitive tasks) 🔗",
    link: affiliateLinks[0],
    confidence: 0.94,
    variations: 5,
  },
  {
    topic: '#SummerDeals2026',
    comment: "Summer sale hunting? Found some incredible deals that most people are sleeping on. These saved me hundreds last month 👀🔥",
    link: affiliateLinks[1],
    confidence: 0.91,
    variations: 4,
  },
  {
    topic: '#FitLife',
    comment: "My fitness transformation this year was possible because of the right gear. Stop overcomplicating it - here's what actually works 💪",
    link: affiliateLinks[3],
    confidence: 0.88,
    variations: 6,
  },
]

export default function ContextMatch() {
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(aiSuggestions[0].comment)
  const [deployed, setDeployed] = useState([])

  const suggestion = aiSuggestions[activeSuggestion]

  const handleDeploy = () => {
    setDeployed(prev => [...prev, suggestion.topic])
    setTimeout(() => {
      setDeployed(prev => prev.filter(t => t !== suggestion.topic))
    }, 3000)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cash-gold/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cash-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ContextMatch™</h3>
            <p className="text-xs text-gray-500">AI-powered comment generation</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <RefreshCw className="w-3 h-3" />
          {suggestion.variations} variations
        </div>
      </div>

      <div className="flex border-b border-dark-border">
        {aiSuggestions.map((s, i) => (
          <button
            key={s.topic}
            onClick={() => { setActiveSuggestion(i); setEditText(s.comment); setEditing(false) }}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-all border-b-2
              ${activeSuggestion === i
                ? 'text-cash-gold border-cash-gold bg-cash-gold/5'
                : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
          >
            {s.topic}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Match Confidence</span>
            <span className="text-sm font-bold text-alert-green">{Math.round(suggestion.confidence * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">{suggestion.link.name}</span>
          </div>
        </div>

        <div className="relative">
          {editing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-dark-bg border border-velocity-blue/30 rounded-lg p-3 text-sm text-gray-200 resize-none focus:outline-none focus:border-velocity-blue/50 min-h-[100px]"
              rows={4}
            />
          ) : (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-gray-300 leading-relaxed min-h-[100px]">
              {editText}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all"
          >
            {editing ? 'Cancel' : 'Edit Comment'}
          </button>
          <button
            onClick={handleDeploy}
            disabled={deployed.includes(suggestion.topic)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
              ${deployed.includes(suggestion.topic)
                ? 'bg-alert-green/20 text-alert-green border border-alert-green/30'
                : 'bg-cash-gold text-gray-900 hover:bg-amber-500 glow-gold'
              }`}
          >
            {deployed.includes(suggestion.topic) ? (
              <><Check className="w-3.5 h-3.5" /> Deployed!</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> Deploy Comment</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
