import { create } from 'zustand'
import { apiFetch } from '../api/client'
import { normalizeJob } from '../api/normalize'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'

function loadArray(key) {
  const v = readJSON(key, [])
  return Array.isArray(v) ? v : []
}

function persist(key, value) {
  writeJSON(key, value)
}

export const useJobsStore = create((set, get) => ({
  jobs: [],
  status: 'idle', // idle | loading | ready | error
  error: null,

  savedJobIds: loadArray(STORAGE_KEYS.savedJobIds),

  fetchJobs: async ({ category, q, location, includeHidden, ownerId, maxDistanceKm } = {}) => {
    set({ status: 'loading', error: null })
    try {
      const query = {
        category: category ? String(category).toLowerCase() : undefined,
        q,
        includeHidden,
        ownerId,
        maxDistanceKm,
        ...(location ? { lat: location.lat, lng: location.lng } : {}),
      }

      const data = await apiFetch('/api/jobs', { query })
      const jobs = (data.jobs || []).map(normalizeJob).filter(Boolean)
      set({ jobs, status: 'ready' })
      return jobs
    } catch (e) {
      set({ status: 'error', error: e })
      return []
    }
  },

  fetchJobById: async (id) => {
    if (!id) return null

    try {
      const data = await apiFetch(`/api/jobs/${encodeURIComponent(id)}`)
      const normalized = normalizeJob(data.job)

      set((s) => {
        const without = s.jobs.filter((j) => j.id !== normalized.id)
        return { jobs: [normalized, ...without] }
      })

      return normalized
    } catch {
      return null
    }
  },

  getJobById: (id) => {
    return get().jobs.find((j) => j.id === id) || null
  },

  createJob: async (payload) => {
    const data = await apiFetch('/api/jobs', { method: 'POST', body: payload })
    const created = normalizeJob(data.job)
    set((s) => ({ jobs: [created, ...s.jobs.filter((j) => j.id !== created.id)] }))
    return created
  },

  setJobHidden: async ({ jobId, hidden }) => {
    const data = await apiFetch(`/api/jobs/${encodeURIComponent(jobId)}/hidden`, {
      method: 'PATCH',
      body: { hidden },
    })

    const updated = normalizeJob(data.job)
    set((s) => ({ jobs: s.jobs.map((j) => (j.id === updated.id ? updated : j)) }))
    return updated
  },

  hideJob: async (jobId) => {
    return get().setJobHidden({ jobId, hidden: true })
  },

  unhideJob: async (jobId) => {
    return get().setJobHidden({ jobId, hidden: false })
  },

  toggleSaved: (jobId) => {
    set((s) => {
      const exists = s.savedJobIds.includes(jobId)
      const next = exists ? s.savedJobIds.filter((id) => id !== jobId) : [jobId, ...s.savedJobIds]
      persist(STORAGE_KEYS.savedJobIds, next)
      return { savedJobIds: next }
    })
  },
}))
