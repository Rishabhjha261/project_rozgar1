import { create } from 'zustand'
import { apiFetch } from '../api/client'
import { usePrefsStore } from '../store/prefsStore'

function normalizeReport(doc) {
  if (!doc) return null

  return {
    id: String(doc._id || doc.id),
    jobId: String(doc.jobId),
    reason: String(doc.reason || ''),
    notes: String(doc.notes || ''),
    status: String(doc.status || 'open'), // open | resolved | hidden
    reporterId: doc.reporterId || null,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).getTime()
      : Date.now(),
  }
}

export const useReportsStore = create((set) => ({
  reports: [],
  status: 'idle', // idle | loading | ready
  error: null,

  // ✅ FETCH REPORTS
  fetchReports: async ({ filterStatus } = {}) => {
    const prefs = usePrefsStore.getState()

    // ✅ DO NOT BLOCK UI
    if (!prefs.clientId || prefs.role !== 'admin') {
      set({
        reports: [],
        status: 'idle',
        error: null,
      })
      return []
    }

    set({ status: 'loading', error: null })

    try {
      const data = await apiFetch('/api/reports', {
        query: { status: filterStatus },
      })

      const reports = (data.reports || [])
        .map(normalizeReport)
        .filter(Boolean)

      set({ reports, status: 'ready' })
      return reports
    } catch (e) {
      set({
        status: 'ready', // ✅ NOT error
        error: {
          message: e.message || 'Failed to fetch reports',
          status: e.status || 500,
        },
      })
      return []
    }
  },

  // ✅ ADD REPORT
  addReport: async ({ jobId, reason, notes }) => {
    set({ error: null })

    try {
      const data = await apiFetch('/api/reports', {
        method: 'POST',
        body: { jobId, reason, notes },
      })

      const created = normalizeReport(data.report)

      set((s) => ({
        reports: [created, ...s.reports],
      }))

      return created
    } catch (e) {
      set({
        error: {
          message: e.message || 'Failed to add report',
          status: e.status || 500,
        },
      })
      return null
    }
  },

  // ✅ RESOLVE / HIDE REPORT
  resolveReport: async (reportId) => {
    const prefs = usePrefsStore.getState()

    if (!prefs.clientId || prefs.role !== 'admin') {
      set({
        error: { message: 'Unauthorized', status: 403 },
      })
      return null
    }

    try {
      const data = await apiFetch(
        `/api/reports/${encodeURIComponent(reportId)}/resolve`,
        { method: 'PATCH' }
      )

      const updated = normalizeReport(data.report)

      set((s) => ({
        status: 'ready',
        reports: s.reports.map((r) =>
          r.id === updated.id ? updated : r
        ),
      }))

      return updated
    } catch (e) {
      set({
        error: {
          message: e.message || 'Failed to resolve report',
          status: e.status || 500,
        },
      })
      return null
    }
  },
}))
