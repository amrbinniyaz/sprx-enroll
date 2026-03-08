import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Bell, Settings } from 'lucide-react'
import { SCHOOL } from '../data/prospects'
import { cn } from '../lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/prospects', label: 'Prospects', icon: Users },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ alertCount }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-slate-950 flex flex-col z-40">
      {/* Brand */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="text-white font-extrabold text-sm tracking-tight">IQ</span>
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-tight leading-none">
              Sprx EnrolIQ
            </div>
            <div className="text-slate-500 text-[11px] font-medium mt-0.5 tracking-wide uppercase">
              Admissions Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* School */}
      <div className="mx-4 mb-5 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.06]">
        <div className="text-slate-300 text-[13px] font-medium truncate">{SCHOOL.name}</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-500 text-[11px]">{SCHOOL.tier} Plan</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Menu
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white/90' : ''} />
                  <span className="text-[13px] font-medium">{label}</span>
                </div>
                {label === 'Alerts' && alertCount > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                    )}
                  >
                    {alertCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-5 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-300 text-xs font-medium truncate">Amanda Kingston</div>
            <div className="text-slate-600 text-[11px]">Head of Admissions</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
