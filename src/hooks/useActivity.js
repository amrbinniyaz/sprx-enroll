import { useState, useEffect, useRef } from 'react'
import { getActivity } from '../api/analytics'
import { ACTIVITY_FEED } from '../data/prospects'

const POLL_INTERVAL = 30_000 // 30 seconds

export function useActivity() {
  const [activity, setActivity] = useState(ACTIVITY_FEED)
  const [isLive, setIsLive] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    function fetchActivity() {
      getActivity()
        .then((data) => {
          if (cancelled) return
          if (data && data.length > 0) {
            setActivity(data)
            setIsLive(true)
          }
        })
        .catch(() => {
          // Keep showing whatever we have (static or previous live data)
        })
    }

    fetchActivity()
    intervalRef.current = setInterval(fetchActivity, POLL_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [])

  return { activity, isLive }
}
