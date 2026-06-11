import { useState } from 'react'
import {
  Radar, LayoutDashboard, Link2, Shield, Activity,
  Settings, ChevronLeft, ChevronRight, Zap, BarChart3, LogOut
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'radar', icon: Radar, label: 'Trend Radar' },
  { id: 'links', icon: Link2, label: 'Affiliate Links' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'stealth', icon: Shield, label: 'StealthMode' },
  { id: 'activity', icon: Activity, label: 'Activity Log' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ activeView, setActiveView }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`fixed left-0 top-0 h-full bg-dark-card border-r border-dark-border z-50 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-dark-border">
        <div className="w-8 h-8 rounded-lg bg-velocity-blue flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold bg-gradient-to-r from-velocity-blue to-cash-gold bg-clip-text text-transparent">
            AffiliJet
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                  ? 'bg-velocity-blue/20 text-velocity-blue border border-velocity-blue/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-velocity-blue' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-2 border-t border-dark-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Disconnect</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
