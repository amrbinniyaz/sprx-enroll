import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Bell, PoundSterling, Settings, LogOut, ChevronDown } from 'lucide-react'
import { SCHOOL } from '../data/prospects'
import { cn } from '../lib/utils'
import logo from '../assets/logo.png'
import crest from '../assets/alleyns-crest.png'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/prospects', label: 'Prospects', icon: Users },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/revenue', label: 'Revenue', icon: PoundSterling },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ alertCount }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[272px] bg-white border-r border-slate-100/80 flex flex-col z-40">
      {/* Brand */}
      <div className="px-6 pt-5 pb-4">
        <img src={logo} alt="SprX EnrolIQ" className="h-10 w-auto" />
      </div>

      {/* School selector */}
      <div className="mx-4 mb-5 bg-slate-50/80 rounded-xl px-4 py-3.5 border border-slate-100 hover:bg-slate-100/60 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-800 text-[13px] font-bold truncate">{SCHOOL.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
              <span className="text-slate-400 text-[11px] font-medium">{SCHOOL.tier} Plan</span>
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <div className="px-3 pb-2.5 text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em]">
          Menu
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm shadow-brand-100/40'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className={isActive ? 'text-brand-600' : ''}
                  />
                  <span className="text-[13px]">{label}</span>
                </div>
                {label === 'Alerts' && alertCount > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full',
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'bg-red-500 text-white'
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
      <div className="px-4 py-4 border-t border-slate-100/80">
        <div className="flex items-center gap-3">
          <img src={crest} alt="Alleyn's" className="w-9 h-9 rounded-lg object-contain flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-slate-800 text-[13px] font-bold truncate">Amanda Kingston</div>
            <div className="text-slate-400 text-[11px]">Head of Admissions</div>
          </div>
          <button className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
