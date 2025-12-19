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

let lastFetchId = 0

export const useJobsStore = create((set, get) => ({
  jobs: [],
  status: 'idle', // idle | loading | ready | error
  error: null,

  savedJobIds: loadArray(STORAGE_KEYS.savedJobIds),

  /* ---------------- FETCH JOBS ---------------- */

  fetchJobs: async ({
    category,
    q,
    location,
    includeHidden,
    ownerId,
    maxDistanceKm,
  } = {}) => {
    const fetchId = ++lastFetchId

    set((s) => ({
      status: s.jobs.length ? s.status : 'loading',
      error: null,
    }))

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

      if (fetchId !== lastFetchId) return get().jobs

      const jobs = (data.jobs || [])
        .map(normalizeJob)
        .filter(Boolean)

      set({ jobs, status: 'ready' })
      return jobs
    } catch (e) {
      if (fetchId !== lastFetchId) return get().jobs

      set({
        status: 'error',
        error: {
          message: e.message || 'Failed to fetch jobs',
          status: e.status || 500,
        },
      })
      return []
    }
  },

  /* ---------------- FETCH SINGLE JOB ---------------- */

  fetchJobById: async (id) => {
    if (!id) return null

    try {
      const data = await apiFetch(`/api/jobs/${encodeURIComponent(id)}`)
      const normalized = normalizeJob(data.job)

      set((s) => ({
        jobs: [
          normalized,
          ...s.jobs.filter((j) => j.id !== normalized.id),
        ],
      }))

      return normalized
    } catch {
      return null
    }
  },

  getJobById: (id) =>
    get().jobs.find((j) => j.id === id) || null,

  /* ---------------- CREATE JOB ---------------- */

  createJob: async (payload) => {
    try {
      const data = await apiFetch('/api/jobs', {
        method: 'POST',
        body: payload,
      })

      const created = normalizeJob(data.job)

      set((s) => ({
        jobs: [
          created,
          ...s.jobs.filter((j) => j.id !== created.id),
        ],
      }))

      return created
    } catch (e) {
      set({
        error: {
          message: e.message || 'Failed to create job',
          status: e.status || 500,
        },
      })
      return null
    }
  },

  /* ---------------- SMOOTH HIDE / UNHIDE ---------------- */

  setJobHidden: async ({ jobId, hidden }) => {
    const prevJobs = get().jobs

    // ✅ Optimistic UI update
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === jobId ? { ...j, hidden } : j
      ),
    }))

    try {
      const data = await apiFetch(
        `/api/jobs/${encodeURIComponent(jobId)}/hidden`,
        {
          method: 'PATCH',
          body: { hidden },
        }
      )

      const updated = normalizeJob(data.job)

      // ✅ Sync with backend response
      set((s) => ({
        jobs: s.jobs.map((j) =>
          j.id === updated.id ? updated : j
        ),
      }))

      return updated
    } catch (e) {
      // 🔁 Rollback on failure
      set({ jobs: prevJobs })

      set({
        error: {
          message: e.message || 'Failed to update job',
          status: e.status || 500,
        },
      })

      return null
    }
  },

  hideJob: async (jobId) =>
    get().setJobHidden({ jobId, hidden: true }),

  unhideJob: async (jobId) =>
    get().setJobHidden({ jobId, hidden: false }),

  /* ---------------- SAVED JOBS ---------------- */

  toggleSaved: (jobId) => {
    set((s) => {
      const exists = s.savedJobIds.includes(jobId)
      const next = exists
        ? s.savedJobIds.filter((id) => id !== jobId)
        : [jobId, ...s.savedJobIds]

      persist(STORAGE_KEYS.savedJobIds, next)
      return { savedJobIds: next }
    })
  },
}))
