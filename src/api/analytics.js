import { apiFetch } from './client'

export function getOverview() {
  return apiFetch('/analytics/overview')
}

export function getTrafficSources() {
  return apiFetch('/analytics/sources')
}
