import { apiFetch } from './client'

export function getProspects() {
  return apiFetch('/prospects')
}

export function getProspect(id) {
  return apiFetch(`/prospects/${id}`)
}
