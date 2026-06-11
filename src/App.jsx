import { useState } from 'react'
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

function DashboardView() {
  return (
    <div className="space-y-4">
      <StatsOverview />
      <Charts />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <TrendingRadar />
        </div>
        <ContextMatch />
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

function RadarView() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <TrendingRadar />
      </div>
      <div className="space-y-4">
        <ContextMatch />
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

function SettingsView() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
          <h4 className="text-sm font-medium text-white mb-2">API Configuration</h4>
          <p className="text-xs text-gray-500 mb-3">Connect your service providers</p>
          <div className="grid grid-cols-3 gap-3">
            {['Twitter API v2', 'OpenAI API', 'Bitly API'].map(service => (
              <div key={service} className="flex items-center justify-between p-3 rounded-lg bg-dark-card border border-dark-border">
                <span className="text-xs text-gray-300">{service}</span>
                <span className="w-2 h-2 rounded-full bg-alert-green" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
          <h4 className="text-sm font-medium text-white mb-2">Account</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">@hustler_affiliate</p>
              <p className="text-xs text-gray-500">Connected since Jan 2026</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const views = {
  dashboard: DashboardView,
  radar: RadarView,
  links: LinksView,
  analytics: AnalyticsView,
  stealth: StealthView,
  activity: ActivityView,
  settings: SettingsView,
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [jetMode, setJetMode] = useState(false)
  const ViewComponent = views[activeView] || DashboardView

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="ml-56 transition-all duration-300">
        <Header jetMode={jetMode} setJetMode={setJetMode} />
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
          <ViewComponent />
        </main>
      </div>
    </div>
  )
}
