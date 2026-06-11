import { useState } from 'react'
import { ShieldCheck, FileText, Link2, ToggleLeft, ToggleRight } from 'lucide-react'
import { complianceSettings } from '../data/mockData'

export default function CompliancePanel() {
  const [settings, setSettings] = useState(complianceSettings)

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} className="transition-colors">
      {value
        ? <ToggleRight className="w-8 h-8 text-alert-green" />
        : <ToggleLeft className="w-8 h-8 text-gray-600" />
      }
    </button>
  )

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-alert-green/10 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-alert-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Auto-Compliance</h3>
          <p className="text-xs text-gray-500">FTC disclosure & link management</p>
        </div>
        <div className="ml-auto px-2 py-1 rounded-md bg-alert-green/10 text-alert-green text-xs font-semibold">
          FTC Compliant
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 px-3 rounded-lg bg-dark-bg/50">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm text-gray-200">Auto Disclosure</div>
              <div className="text-xs text-gray-500">Automatically add #Ad to all comments</div>
            </div>
          </div>
          <Toggle value={settings.autoDisclosure} onChange={(v) => setSettings({...settings, autoDisclosure: v})} />
        </div>

        <div className="flex items-center justify-between py-3 px-3 rounded-lg bg-dark-bg/50">
          <div className="flex items-center gap-3">
            <Link2 className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm text-gray-200">Link Shortening</div>
              <div className="text-xs text-gray-500">Auto-shorten via {settings.shortenerService}</div>
            </div>
          </div>
          <Toggle value={settings.linkShortening} onChange={(v) => setSettings({...settings, linkShortening: v})} />
        </div>

        <div className="flex items-center justify-between py-3 px-3 rounded-lg bg-dark-bg/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm text-gray-200">Disclosure Log</div>
              <div className="text-xs text-gray-500">Keep audit trail of all disclosures</div>
            </div>
          </div>
          <Toggle value={settings.disclosureLog} onChange={(v) => setSettings({...settings, disclosureLog: v})} />
        </div>

        <div className="mt-3 p-3 rounded-lg border border-dark-border">
          <label className="text-xs text-gray-500 mb-2 block">Disclosure Template</label>
          <input
            type="text"
            value={settings.disclosureTemplate}
            onChange={(e) => setSettings({...settings, disclosureTemplate: e.target.value})}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-velocity-blue/50"
          />
          <p className="text-[10px] text-gray-600 mt-1">Use {'{link}'} as placeholder for the affiliate URL</p>
        </div>
      </div>
    </div>
  )
}
