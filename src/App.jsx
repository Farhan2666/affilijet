import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import TickerBar from './components/TickerBar'
import StatsOverview from './components/StatsOverview'
import TrendingRadar from './components/TrendingRadar'
import ContextMatch from './components/ContextMatch'
import StealthPanel from './components/StealthPanel'
import CompliancePanel from './components/CompliancePanel'
import ActivityFeed from './components/ActivityFeed'
import Charts from './components/Charts'
import AffiliateLinksPanel from './components/AffiliateLinksPanel'
import BYOKModal from './components/BYOKModal'
import LoginModal from './components/LoginModal'
import { getAPIKey } from './utils/encryption'
import { isLoggedIn, getCurrentUser, clearSessionCookie } from './utils/cookies'

function DashboardView({ onOpenBYOK, selectedProvider, selectedModel }) {
  return (
    <div className="space-y-4">
      <StatsOverview />
      <Charts />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <TrendingRadar />
        </div>
        <ContextMatch onOpenSettings={onOpenBYOK} selectedProvider={selectedProvider} selectedModel={selectedModel} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ActivityFeed />
        </div>
        <CompliancePanel />
      </div>
    </div>
  )
}

function RadarView({ onOpenBYOK, selectedProvider, selectedModel }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <TrendingRadar />
      </div>
      <div className="space-y-4">
        <ContextMatch onOpenSettings={onOpenBYOK} selectedProvider={selectedProvider} selectedModel={selectedModel} />
        <StealthPanel />
      </div>
    </div>
  )
}

function LinksView() {
  return (
    <div className="space-y-4">
      <AffiliateLinksPanel />
      <CompliancePanel />
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="space-y-4">
      <StatsOverview />
      <Charts />
      <ActivityFeed />
    </div>
  )
}

function StealthView() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StealthPanel />
      <CompliancePanel />
    </div>
  )
}

function ActivityView() {
  return <ActivityFeed />
}

function SettingsView({ onOpenBYOK, selectedProvider, user, onLogout }) {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="text-sm font-medium text-white mb-2">Account</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">{user ? `@${user.username}` : 'Not logged in'}</p>
                <p className="text-xs text-gray-500">
                  {user?.provider === 'twitter' ? 'Twitter session' : 'No active session'}
                </p>
              </div>
              {user ? (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="text-sm font-medium text-white mb-2">AI Provider (BYOK)</h4>
            <p className="text-xs text-gray-500 mb-3">Configure your AI provider for comment generation</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  {selectedProvider ? `Active: ${selectedProvider}` : 'No provider configured'}
                </p>
                <p className="text-xs text-gray-500">Bring Your Own Key — keys stored locally & encrypted</p>
              </div>
              <button onClick={onOpenBYOK} className="btn-primary text-xs">
                Configure AI
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="text-sm font-medium text-white mb-2">API Configuration</h4>
            <p className="text-xs text-gray-500 mb-3">Backend service connections</p>
            <div className="grid grid-cols-3 gap-3">
              {['Twitter API v2', 'OpenAI API', 'Bitly API'].map(service => (
                <div key={service} className="flex items-center justify-between p-3 rounded-lg bg-dark-card border border-dark-border">
                  <span className="text-xs text-gray-300">{service}</span>
                  <span className="w-2 h-2 rounded-full bg-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [jetMode, setJetMode] = useState(false)
  const [byokOpen, setByokOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [user, setUser] = useState(null)

  const loadProvider = () => {
    const providers = ['openai', 'anthropic', 'gemini', 'openrouter', 'deepseek', 'groq']
    for (const p of providers) {
      const keyData = getAPIKey(p)
      if (keyData) {
        setSelectedProvider(p)
        setSelectedModel(keyData.model)
        return
      }
    }
  }

  useEffect(() => {
    loadProvider()
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      setLoginOpen(true)
    }
  }, [])

  const handleBYOKClose = () => {
    setByokOpen(false)
    loadProvider()
  }

  const handleLogin = (session) => {
    setUser(session)
  }

  const handleLogout = () => {
    clearSessionCookie()
    setUser(null)
    setLoginOpen(true)
  }

  const viewProps = {
    onOpenBYOK: () => setByokOpen(true),
    selectedProvider,
    selectedModel,
    user,
    onLogout: handleLogout
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView {...viewProps} />
      case 'radar': return <RadarView {...viewProps} />
      case 'links': return <LinksView />
      case 'analytics': return <AnalyticsView />
      case 'stealth': return <StealthView />
      case 'activity': return <ActivityView />
      case 'settings': return <SettingsView {...viewProps} />
      default: return <DashboardView {...viewProps} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="ml-56 transition-all duration-300">
        <Header
          jetMode={jetMode}
          setJetMode={setJetMode}
          onOpenBYOK={() => setByokOpen(true)}
          user={user}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={handleLogout}
        />
        <TickerBar />

        {jetMode && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-cash-gold/10 border border-cash-gold/30 flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="text-sm font-bold text-cash-gold">JET MODE ACTIVE</p>
              <p className="text-xs text-gray-400">Burst commenting enabled — deploying to top trending topics with randomized stealth patterns</p>
            </div>
            <button onClick={() => setJetMode(false)} className="ml-auto text-xs text-gray-500 hover:text-white transition-colors">
              Deactivate
            </button>
          </div>
        )}

        <main className="p-6">
          {renderView()}
        </main>
      </div>

      <BYOKModal isOpen={byokOpen} onClose={handleBYOKClose} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
    </div>
  )
}
