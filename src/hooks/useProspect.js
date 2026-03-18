import { useState, useEffect } from 'react'
import { getProspect } from '../api/prospects'
import { PROSPECTS } from '../data/prospects'

export function useProspect(id) {
  const [prospect, setProspect] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Numeric IDs are mock data — skip API call
    const mockProspect = PROSPECTS.find((p) => String(p.id) === String(id))
    if (mockProspect) {
      setProspect(mockProspect)
      setLoading(false)
      return
    }

    // UUID IDs are live PostHog data — fetch from API
    getProspect(id)
      .then((data) => {
        if (cancelled) return
        if (data && !data.error) {
          setProspect(data)
          setIsLive(true)
        } else {
          setProspect(null)
        }
      })
      .catch(() => {
        if (!cancelled) setProspect(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { prospect, loading, error, isLive }
}
