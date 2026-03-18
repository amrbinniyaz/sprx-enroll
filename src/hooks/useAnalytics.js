import { useState, useEffect } from 'react'
import { getOverview, getTrafficSources } from '../api/analytics'
import { GA4_OVERVIEW, TRAFFIC_SOURCES } from '../data/analytics'

export function useAnalytics() {
  const [overview, setOverview] = useState(null)
  const [sources, setSources] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([getOverview(), getTrafficSources()])
      .then(([ov, src]) => {
        if (cancelled) return
        if (ov && ov.total_visitors > 0) {
          setOverview(ov)
          setIsLive(true)
        } else {
          setOverview(GA4_OVERVIEW)
        }
        setSources(src && src.length > 0 ? src : TRAFFIC_SOURCES)
      })
      .catch(() => {
        if (!cancelled) {
          setOverview(GA4_OVERVIEW)
          setSources(TRAFFIC_SOURCES)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return {
    overview: overview || GA4_OVERVIEW,
    sources: sources || TRAFFIC_SOURCES,
    loading,
    isLive,
  }
}
