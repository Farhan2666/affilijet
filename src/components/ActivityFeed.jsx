import { MessageSquare, Inbox } from 'lucide-react'

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
            <p className="text-xs text-gray-500">Deployment log</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-10 h-10 text-gray-600 mb-3" />
        <p className="text-sm text-gray-400 mb-1">No activity yet</p>
        <p className="text-xs text-gray-600">Deployed comments will appear here</p>
      </div>
    </div>
  )
}
