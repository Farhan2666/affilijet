import { useState, useEffect } from 'react'
import { Sparkles, Link2, Check, Send, Settings, AlertCircle, Loader2 } from 'lucide-react'
import { generateCommentBYOK } from '../services/ai-providers'
import { getAPIKey, getAllAPIKeys } from '../utils/encryption'

export default function ContextMatch({ onOpenSettings, selectedProvider, selectedModel }) {
  const [topic, setTopic] = useState('')
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkNiche, setLinkNiche] = useState('')
  const [variations, setVariations] = useState([])
  const [activeVariation, setActiveVariation] = useState(0)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [deployed, setDeployed] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [hasKeys, setHasKeys] = useState(false)
  const [providerInfo, setProviderInfo] = useState('')

  useEffect(() => {
    const keys = getAllAPIKeys()
    setHasKeys(Object.keys(keys).length > 0)
    if (selectedProvider && selectedModel) setProviderInfo(`${selectedProvider} / ${selectedModel}`)
  }, [selectedProvider, selectedModel])

  useEffect(() => {
    if (variations.length > 0 && variations[activeVariation]) setEditText(variations[activeVariation].text)
  }, [activeVariation, variations])

  const handleGenerate = async () => {
    if (!selectedProvider || !selectedModel) { setError('Select AI provider in settings'); return }
    if (!topic.trim()) { setError('Enter a topic'); return }
    if (!linkUrl.trim()) { setError('Enter affiliate link'); return }

    const keyData = getAPIKey(selectedProvider)
    if (!keyData) { setError('No API key found'); return }

    setLoading(true)
    setError('')
    setVariations([])

    try {
      const result = await generateCommentBYOK(selectedProvider, keyData.apiKey, keyData.model, topic, { name: linkName || 'Product', url: linkUrl, niche: linkNiche || 'General' })
      setVariations(result.variations)
      setConfidence(result.confidence)
      setActiveVariation(0)
      setEditText(result.variations[0]?.text || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = () => {
    setDeployed(prev => [...prev, topic])
    setTimeout(() => setDeployed(prev => prev.filter(t => t !== topic)), 3000)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-dark-border">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-cash-gold/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-cash-gold" />
          </div>
          <div>
            <h3 className="text-xs lg:text-sm font-semibold text-white">ContextMatch™</h3>
            <p className="text-[10px] lg:text-xs text-gray-500 truncate max-w-[120px] lg:max-w-none">{providerInfo || 'AI comments'}</p>
          </div>
        </div>
        <button onClick={onOpenSettings} className="p-1.5 lg:p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </button>
      </div>

      <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
        <div>
          <label className="text-[10px] lg:text-xs text-gray-500 mb-1 block">Topic</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:outline-none focus:border-velocity-blue/50" placeholder="#topic" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] lg:text-xs text-gray-500 mb-1 block">Product</label>
            <input type="text" value={linkName} onChange={(e) => setLinkName(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:outline-none focus:border-velocity-blue/50" placeholder="Name" />
          </div>
          <div>
            <label className="text-[10px] lg:text-xs text-gray-500 mb-1 block">Niche</label>
            <input type="text" value={linkNiche} onChange={(e) => setLinkNiche(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:outline-none focus:border-velocity-blue/50" placeholder="Tech" />
          </div>
          <div>
            <label className="text-[10px] lg:text-xs text-gray-500 mb-1 block">URL</label>
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs lg:text-sm text-white focus:outline-none focus:border-velocity-blue/50" placeholder="https://..." />
          </div>
        </div>

        {error && (
          <div className="p-2 lg:p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs lg:text-sm text-red-400">{error}</p>
              <button onClick={onOpenSettings} className="text-[10px] lg:text-xs text-velocity-blue hover:underline mt-1">Settings →</button>
            </div>
          </div>
        )}

        <button onClick={handleGenerate} disabled={loading || !hasKeys} className={`w-full py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold flex items-center justify-center gap-2 transition-all ${loading || !hasKeys ? 'bg-dark-border text-gray-500 cursor-not-allowed' : 'bg-velocity-blue text-white hover:bg-blue-600 glow-blue'}`}>
          {loading ? <><Loader2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" /> Generating...</> : !hasKeys ? <><Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Setup AI First</> : <><Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Generate</>}
        </button>

        {variations.length > 0 && (
          <>
            <div className="flex gap-1 border-b border-dark-border overflow-x-auto">
              {variations.map((v, i) => (
                <button key={i} onClick={() => { setActiveVariation(i); setEditText(v.text); setEditing(false) }} className={`flex-shrink-0 px-2 lg:px-3 py-2 text-[10px] lg:text-xs font-medium transition-all border-b-2 capitalize ${activeVariation === i ? 'text-cash-gold border-cash-gold bg-cash-gold/5' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                  {v.variation || `v${i + 1}`}
                </button>
              ))}
            </div>

            <div className="relative">
              {editing ? (
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-dark-bg border border-velocity-blue/30 rounded-lg p-2 lg:p-3 text-xs lg:text-sm text-gray-200 resize-none focus:outline-none focus:border-velocity-blue/50 min-h-[80px] lg:min-h-[100px]" rows={4} />
              ) : (
                <div className="bg-dark-bg border border-dark-border rounded-lg p-2 lg:p-3 text-xs lg:text-sm text-gray-300 leading-relaxed min-h-[80px] lg:min-h-[100px]">{editText}</div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="flex-1 py-2 rounded-lg text-xs font-medium border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all">{editing ? 'Cancel' : 'Edit'}</button>
              <button onClick={handleDeploy} disabled={deployed.includes(topic)} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${deployed.includes(topic) ? 'bg-alert-green/20 text-alert-green border border-alert-green/30' : 'bg-cash-gold text-gray-900 hover:bg-amber-500 glow-gold'}`}>
                {deployed.includes(topic) ? <><Check className="w-3.5 h-3.5" /> Done</> : <><Send className="w-3.5 h-3.5" /> Deploy</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
