import { Mail, Phone, Calendar, User, Clock, MessageSquare } from 'lucide-react'

const STAGE_COLORS = {
  'Enquiry': 'bg-blue-500',
  'Tour Booked': 'bg-indigo-500',
  'Tour Attended': 'bg-violet-500',
  'Application': 'bg-purple-500',
  'Offer Made': 'bg-amber-500',
  'Enrolled': 'bg-emerald-500',
}

function StagePipeline({ pipeline, currentStageIndex }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deal Pipeline</div>
      <div className="flex gap-1">
        {pipeline.map((stage, i) => {
          const isActive = i === currentStageIndex
          const isPast = i < currentStageIndex
          const isFuture = i > currentStageIndex
          const isNone = currentStageIndex === -1

          return (
            <div key={stage} className="flex-1 group relative">
              <div
                className={`h-2 rounded-full transition-all ${
                  isNone
                    ? 'bg-slate-100'
                    : isActive
                      ? STAGE_COLORS[stage] || 'bg-brand-500'
                      : isPast
                        ? `${STAGE_COLORS[stage] || 'bg-brand-500'} opacity-60`
                        : 'bg-slate-100'
                }`}
              />
              <div className={`text-[9px] mt-1 text-center truncate font-medium ${
                isActive ? 'text-slate-800 font-bold' : isPast ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {stage}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HubSpotCard({ hubspot }) {
  if (!hubspot) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-100/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-orange-50/80 border-b border-orange-100/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
            <span className="text-sm font-bold text-orange-600">H</span>
          </div>
          <div>
            <div className="text-xs font-bold text-orange-700">HubSpot CRM</div>
            <div className="text-[11px] text-orange-500 mt-0.5">
              {hubspot.lifecycleStage} · {hubspot.leadStatus}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-100/80 px-2 py-0.5 rounded-md">
          Synced
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Deal Pipeline */}
        <StagePipeline
          pipeline={hubspot.pipeline}
          currentStageIndex={hubspot.currentStageIndex}
        />

        {/* Current Stage + Value */}
        <div className="flex gap-3">
          <div className="flex-1 bg-slate-50/80 rounded-xl p-3 border border-slate-100/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Current Stage</div>
            <div className="text-sm font-bold text-slate-800">
              {hubspot.dealStage || 'Not in pipeline'}
            </div>
          </div>
          <div className="flex-1 bg-slate-50/80 rounded-xl p-3 border border-slate-100/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Deal Value</div>
            <div className="text-sm font-bold text-slate-800">
              £{hubspot.dealValue?.toLocaleString()}/yr
            </div>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
            <User size={13} className="text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Deal Owner</div>
            <div className="text-[13px] font-semibold text-slate-800">{hubspot.dealOwner}</div>
          </div>
        </div>

        {/* Communications Grid */}
        <div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Communications</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/60 text-center">
              <Mail size={13} className="text-blue-400 mx-auto mb-1" />
              <div className="stat-number text-lg text-slate-900">{hubspot.emailsSent}</div>
              <div className="text-[9px] text-slate-400 font-medium">Emails</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/60 text-center">
              <Phone size={13} className="text-emerald-400 mx-auto mb-1" />
              <div className="stat-number text-lg text-slate-900">{hubspot.callsMade}</div>
              <div className="text-[9px] text-slate-400 font-medium">Calls</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/60 text-center">
              <Calendar size={13} className="text-violet-400 mx-auto mb-1" />
              <div className="stat-number text-lg text-slate-900">{hubspot.meetingsBooked}</div>
              <div className="text-[9px] text-slate-400 font-medium">Meetings</div>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center gap-1.5 pt-1">
          <Clock size={10} className="text-slate-300" />
          <span className="text-[10px] text-slate-400">
            Last CRM activity: <strong className="text-slate-600">{hubspot.lastCrmActivity || 'No activity'}</strong>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 ml-auto" />
          <span className="text-[10px] text-orange-500 font-medium">HubSpot</span>
        </div>
      </div>
    </div>
  )
}
