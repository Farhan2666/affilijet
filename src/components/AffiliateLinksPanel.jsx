import { useState } from 'react'
import { Link2, Plus, ExternalLink, Pause, Play, Inbox } from 'lucide-react'

export default function AffiliateLinksPanel() {
  const [links, setLinks] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newLink, setNewLink] = useState({ name: '', url: '', niche: '' })

  const addLink = () => {
    if (!newLink.name || !newLink.url || !newLink.niche) return
    
    const link = {
      id: Date.now(),
      ...newLink,
      status: 'active',
      conversions: 0,
      ctr: 0,
      shortenLinks: true
    }
    
    setLinks(prev => [...prev, link])
    
    try {
      const stored = JSON.parse(localStorage.getItem('affilijet_links') || '[]')
      stored.push(link)
      localStorage.setItem('affilijet_links', JSON.stringify(stored))
    } catch (e) {}
    
    setNewLink({ name: '', url: '', niche: '' })
    setShowAdd(false)
  }

  const toggleStatus = (id) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l))
    
    try {
      const stored = JSON.parse(localStorage.getItem('affilijet_links') || '[]')
      const updated = stored.map(l => l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l)
      localStorage.setItem('affilijet_links', JSON.stringify(updated))
    } catch (e) {}
  }

  useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('affilijet_links') || '[]')
      if (stored.length > 0) setLinks(stored)
    } catch (e) {}
  })

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
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Link
        </button>
      </div>

      {showAdd && (
        <div className="p-4 border-b border-dark-border bg-dark-bg/50 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={newLink.name}
              onChange={(e) => setNewLink({...newLink, name: e.target.value})}
              placeholder="Link name"
              className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
            />
            <input
              type="text"
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              placeholder="https://..."
              className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
            />
            <input
              type="text"
              value={newLink.niche}
              onChange={(e) => setNewLink({...newLink, niche: e.target.value})}
              placeholder="Niche"
              className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-velocity-blue/50"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addLink} className="btn-primary text-xs py-1.5 px-4">Save</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 hover:text-white px-4 py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400 mb-1">No affiliate links yet</p>
          <p className="text-xs text-gray-600">Add your first affiliate link to get started</p>
        </div>
      ) : (
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
                    <span className="text-sm font-semibold text-gray-400">{link.ctr}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      link.status === 'active' ? 'bg-alert-green/10 text-alert-green' : 'bg-cash-gold/10 text-cash-gold'
                    }`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(link.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
                    >
                      {link.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
