import { useState, useEffect } from 'react'
import { Key, Save, Trash2, Check, X, Eye, EyeOff, Shield, AlertCircle, Edit3 } from 'lucide-react'
import { getProviders } from '../services/ai-providers'
import { saveAPIKey, getAPIKey, removeAPIKey, getAllAPIKeys, testAPIKey } from '../utils/encryption'

export default function BYOKModal({ isOpen, onClose }) {
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [customModel, setCustomModel] = useState('')
  const [useCustomModel, setUseCustomModel] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [savedKeys, setSavedKeys] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (isOpen) {
      setProviders(getProviders())
      setSavedKeys(getAllAPIKeys())
      setUseCustomModel(false)
      setCustomModel('')
    }
  }, [isOpen])

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    const provider = providers.find(p => p.id === providerId)
    if (provider) {
      setSelectedModel(provider.defaultModel)
      const existing = getAPIKey(providerId)
      if (existing) {
        setApiKey(existing.apiKey)
        setSelectedModel(existing.model)
        if (!provider.models.includes(existing.model)) {
          setUseCustomModel(true)
          setCustomModel(existing.model)
        }
      } else {
        setApiKey('')
      }
    }
  }

  const handleSave = () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API Key cannot be empty' })
      return
    }

    const model = useCustomModel ? customModel.trim() : selectedModel
    if (!model) {
      setMessage({ type: 'error', text: 'Please select or enter a model' })
      return
    }

    const test = testAPIKey(selectedProvider, apiKey)
    if (!test.valid) {
      setMessage({ type: 'error', text: test.message })
      return
    }

    const success = saveAPIKey(selectedProvider, apiKey, model)
    if (success) {
      setSavedKeys(getAllAPIKeys())
      setMessage({ type: 'success', text: 'API Key saved successfully' })
      setApiKey('')
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } else {
      setMessage({ type: 'error', text: 'Failed to save API key' })
    }
  }

  const handleDelete = (providerId) => {
    removeAPIKey(providerId)
    setSavedKeys(getAllAPIKeys())
    setMessage({ type: 'success', text: 'API Key removed' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-dark-card border-t sm:border border-dark-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-4 lg:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-velocity-blue/10 flex items-center justify-center">
              <Key className="w-4 h-4 lg:w-5 lg:h-5 text-velocity-blue" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-white">AI Provider Settings</h2>
              <p className="text-xs text-gray-500">Bring Your Own Key (BYOK)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="p-3 lg:p-4 rounded-lg bg-velocity-blue/10 border border-velocity-blue/20">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-velocity-blue flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs lg:text-sm font-semibold text-white mb-1">Your Keys Stay Safe</h3>
                <p className="text-xs text-gray-400">
                  API keys are encrypted and stored locally in your browser.
                </p>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-alert-green/10 border border-alert-green/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {message.type === 'success' ? <Check className="w-4 h-4 text-alert-green" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span className={`text-sm ${message.type === 'success' ? 'text-alert-green' : 'text-red-400'}`}>{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Select Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {providers.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderChange(provider.id)}
                    className={`p-2.5 lg:p-3 rounded-lg border transition-all text-left ${
                      selectedProvider === provider.id
                        ? 'bg-velocity-blue/20 border-velocity-blue/50 text-white'
                        : 'bg-dark-bg border-dark-border text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xs lg:text-sm font-medium">{provider.name}</div>
                    {savedKeys[provider.id] && (
                      <div className="text-xs text-alert-green mt-1">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Model</label>
                    <button
                      onClick={() => setUseCustomModel(!useCustomModel)}
                      className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-all ${
                        useCustomModel ? 'bg-cash-gold/20 text-cash-gold' : 'bg-dark-bg text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      {useCustomModel ? 'Custom' : 'Default'}
                    </button>
                  </div>
                  
                  {useCustomModel ? (
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="Enter model name"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-white font-mono focus:outline-none focus:border-velocity-blue/50"
                    />
                  ) : (
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
                    >
                      {providers.find(p => p.id === selectedProvider)?.models.map(model => (
                        <option key={model} value={model}>
                          {model} {model.includes(':free') ? '(FREE)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {selectedProvider === 'openrouter' && (
                    <p className="text-xs text-cash-gold mt-1.5">💡 Models with ":free" are free</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">API Key</label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 lg:px-4 py-2 lg:py-2.5 pr-12 text-sm text-white font-mono focus:outline-none focus:border-velocity-blue/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5 transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  {savedKeys[selectedProvider] && (
                    <button onClick={() => handleDelete(selectedProvider)} className="px-3 lg:px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {Object.keys(savedKeys).length > 0 && (
            <div className="border-t border-dark-border pt-4 lg:pt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Configured</h3>
              <div className="space-y-2">
                {Object.entries(savedKeys).map(([providerId, data]) => (
                  <div key={providerId} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg border border-dark-border">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">{providers.find(p => p.id === providerId)?.name}</div>
                      <div className="text-xs text-gray-500 truncate">{data.model} • {data.apiKey}</div>
                    </div>
                    <button onClick={() => handleDelete(providerId)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all flex-shrink-0 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
