import { useMemo } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { PROSPECTS } from './data/prospects'
import { useToast } from './hooks/useToast'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import ProspectList from './pages/ProspectList'
import ProspectProfile from './pages/ProspectProfile'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import RevenueIntelligence from './pages/RevenueIntelligence'
import WebsiteIntelligence from './pages/WebsiteIntelligence'
import AIChat from './components/AIChat'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/prospects': 'Prospects',
  '/alerts': 'Alerts',
  '/revenue': 'Revenue Intelligence',
  '/website': 'Website Intelligence',
  '/settings': 'Settings',
}

export default function App() {
  const location = useLocation()
  const { toast, showToast, hideToast } = useToast()

  const alertCount = useMemo(
    () =>
      PROSPECTS.filter(
        (p) => p.band === 'hot' || p.pattern === 'going_cold' || p.pattern === 'silent_stalker'
      ).length,
    []
  )

  const isProfile = location.pathname.startsWith('/prospects/')
  const prospect = isProfile
    ? PROSPECTS.find((p) => p.id === Number(location.pathname.split('/')[2]))
    : null

  const title = isProfile && prospect ? prospect.name : PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-ivory bg-noise">
      <Sidebar alertCount={alertCount} />

      <div className="ml-[272px] min-h-screen relative z-10">
        <TopBar title={title} alertCount={alertCount} />

        <main className="px-8 py-7">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<ProspectList />} />
            <Route
              path="/prospects/:id"
              element={<ProspectProfile onToast={showToast} />}
            />
            <Route path="/alerts" element={<Alerts onToast={showToast} />} />
            <Route path="/revenue" element={<RevenueIntelligence />} />
            <Route path="/website" element={<WebsiteIntelligence />} />
            <Route path="/settings" element={<Settings onToast={showToast} />} />
          </Routes>
        </main>
      </div>

      {toast && <Toast message={toast} onClose={hideToast} />}
      <AIChat />
    </div>
  )
}
