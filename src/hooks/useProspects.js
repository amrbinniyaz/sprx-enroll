import { useState, useEffect } from 'react'
import { getProspects } from '../api/prospects'
import { PROSPECTS } from '../data/prospects'

export function useProspects() {
  const [prospects, setProspects] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    getProspects()
      .then((data) => {
        if (cancelled) return
        if (data && data.length > 0) {
          // Merge: mock data first, then live data appended
          setProspects([...PROSPECTS, ...data])
          setIsLive(true)
        } else {
          setProspects(PROSPECTS)
        }
      })
      .catch(() => {
        if (!cancelled) setProspects(PROSPECTS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { prospects: prospects || PROSPECTS, loading, error, isLive }
}
