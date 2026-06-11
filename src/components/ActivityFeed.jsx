import { MessageSquare, Clock, AlertTriangle, Link2, Zap, CheckCircle, Info } from 'lucide-react'
import { recentActivity } from '../data/mockData'

function ActionIcon({ action }) {
  switch (action) {
    case 'comment_deployed': return <MessageSquare className="w-3.5 h-3.5" />
    case 'stealth_delay': return <Clock className="w-3.5 h-3.5" />
    case 'compliance_check': return <CheckCircle className="w-3.5 h-3.5" />
    case 'shadowban_alert': return <AlertTriangle className="w-3.5 h-3.5" />
    case 'link_matched': return <Link2 className="w-3.5 h-3.5" />
    default: return <Zap className="w-3.5 h-3.5" />
  }
}

function statusColor(status) {
  switch (status) {
    case 'success': return 'text-alert-green bg-alert-green/10'
    case 'warning': return 'text-cash-gold bg-cash-gold/10'
    case 'waiting': return 'text-velocity-blue bg-velocity-blue/10'
    case 'info': return 'text-gray-400 bg-gray-500/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

function actionLabel(action) {
  switch (action) {
    case 'comment_deployed': return 'Comment Deployed'
    case 'stealth_delay': return 'Stealth Delay'
    case 'compliance_check': return 'Compliance OK'
    case 'shadowban_alert': return 'Risk Alert'
    case 'link_matched': return 'Link Matched'
    default: return action
  }
}

export default function ActivityFeed() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stealth-gray/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Activity Feed</h3>
            <p className="text-xs text-gray-500">Real-time deployment log</p>
          </div>
        </div>
        <span className="badge-live">LIVE</span>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {recentActivity.map((item, i) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3 border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${statusColor(item.status)}`}>
              <ActionIcon action={item.action} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-200">{actionLabel(item.action)}</span>
                <span className="text-xs text-gray-600">→</span>
                <span className="text-xs text-velocity-blue font-medium">{item.topic}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">to {item.reply_to}</span>
                <span className="text-xs text-gray-700">•</span>
                <span className="text-xs text-gray-600">{item.link}</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-600 flex-shrink-0 mt-1">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
