import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'

export default function TopBar({ title, alertCount }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-100/60 px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium">Alleyn's School</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-slate-800 font-bold">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 font-medium tracking-wide">March 2026</span>
        <div className="w-px h-5 bg-slate-200" />
        <div className="relative">
          <button
            onClick={() => navigate('/alerts')}
            className="w-9 h-9 bg-slate-50/80 border border-slate-200/60 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Bell size={16} className="text-slate-500" />
          </button>
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-sm shadow-red-500/30">
              {alertCount}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
