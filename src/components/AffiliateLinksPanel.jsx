import { Link2, TrendingUp, MousePointerClick, DollarSign, Pause, Play, Trash2, Plus, ExternalLink } from 'lucide-react'
import { affiliateLinks } from '../data/mockData'
import { useState } from 'react'

function StatusBadge({ status }) {
  return status === 'active'
    ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-alert-green/10 text-alert-green">Active</span>
    : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cash-gold/10 text-cash-gold">Paused</span>
}

export default function AffiliateLinksPanel() {
  const [links, setLinks] = useState(affiliateLinks)

  const toggleStatus = (id) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l))
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cash-gold/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-cash-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Affiliate Links</h3>
            <p className="text-xs text-gray-500">{links.filter(l => l.status === 'active').length} active of {links.length}</p>
          </div>
        </div>
        <button className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3">
          <Plus className="w-3.5 h-3.5" />
          Import Links
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Link</th>
              <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Niche</th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Conversions</th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">CTR</th>
              <th className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link.id} className="border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{link.url}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-400 bg-dark-bg px-2 py-1 rounded">{link.niche}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-white">{link.conversions}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-semibold ${link.ctr > 4 ? 'text-alert-green' : link.ctr > 3 ? 'text-cash-gold' : 'text-gray-400'}`}>
                    {link.ctr}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={link.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleStatus(link.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
                    >
                      {link.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
