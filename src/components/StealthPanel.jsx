import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Shuffle } from 'lucide-react'
import { shadowbanRisk, complianceSettings } from '../data/mockData'

function RiskMeter({ score }) {
  const radius = 60
  const circumference = Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score < 25 ? '#10B981' : score < 50 ? '#F59E0B' : score < 75 ? '#F97316' : '#EF4444'

  return (
    <div className="relative w-36 h-20 mx-auto">
      <svg viewBox="0 0 140 80" className="w-full h-full">
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="#1E293B"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-500 uppercase">Risk Score</span>
      </div>
    </div>
  )
}

function StatusIcon({ status }) {
  if (status === 'safe') return <CheckCircle className="w-4 h-4 text-alert-green" />
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-cash-gold" />
  return <AlertTriangle className="w-4 h-4 text-red-400" />
}

export default function StealthPanel() {
  const [settings, setSettings] = useState(complianceSettings)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-alert-green/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-alert-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Shadowban Risk Meter</h3>
            <p className="text-xs text-gray-500">Real-time account safety score</p>
          </div>
        </div>

        <RiskMeter score={shadowbanRisk.score} />

        <div className="mt-4 space-y-2">
          {shadowbanRisk.factors.map(factor => (
            <div key={factor.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-bg/50">
              <div className="flex items-center gap-2">
                <StatusIcon status={factor.status} />
                <span className="text-xs text-gray-300">{factor.name}</span>
              </div>
              <span className="text-xs text-gray-500">{factor.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-velocity-blue/10 flex items-center justify-center">
            <Shuffle className="w-4 h-4 text-velocity-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">StealthMode Settings</h3>
            <p className="text-xs text-gray-500">Randomized pattern configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min Delay (sec)</label>
              <input
                type="number"
                value={settings.minDelaySeconds}
                onChange={(e) => setSettings({...settings, minDelaySeconds: +e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Delay (sec)</label>
              <input
                type="number"
                value={settings.maxDelaySeconds}
                onChange={(e) => setSettings({...settings, maxDelaySeconds: +e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Comments/Hour</label>
              <input
                type="number"
                value={settings.maxCommentsPerHour}
                onChange={(e) => setSettings({...settings, maxCommentsPerHour: +e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Per Topic</label>
              <input
                type="number"
                value={settings.maxCommentsPerTopic}
                onChange={(e) => setSettings({...settings, maxCommentsPerTopic: +e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-300">Cooldown Between Bursts</span>
            </div>
            <button
              onClick={() => setSettings({...settings, cooldownEnabled: !settings.cooldownEnabled})}
              className={`w-10 h-5 rounded-full transition-all ${settings.cooldownEnabled ? 'bg-alert-green' : 'bg-dark-border'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-0.5 ${settings.cooldownEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
