import { useState, useEffect } from 'react'
import { getDashboardTrends } from '../api/analytics'

const EMPTY = { dau: [], wau: [], growth: [], retention: [] }

export function useDashboardTrends() {
  const [trends, setTrends] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDashboardTrends()
      .then((data) => {
        if (cancelled) return
        if (data && (data.dau?.length > 0 || data.wau?.length > 0)) {
          setTrends(data)
          setIsLive(true)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { trends, loading, isLive }
}
