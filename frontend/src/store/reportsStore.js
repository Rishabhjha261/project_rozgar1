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
    status: String(doc.status || 'open'),
    reporterId: doc.reporterId || null,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).getTime()
      : Date.now(),
  }
}

export const useReportsStore = create((set) => ({
  reports: [],
  status: 'idle', // idle | loading | ready | error
  error: null,

  fetchReports: async ({ filterStatus } = {}) => {
    const prefs = usePrefsStore.getState()

    // ✅ Graceful admin guard
    if (!prefs.clientId || prefs.role !== 'admin') {
      set({
        reports: [],
        status: 'error',
        error: { message: 'Unauthorized', status: 403 },
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
        status: 'error',
        error: {
          message: e.message || 'Failed to fetch reports',
          status: e.status || 500,
        },
      })
      return []
    }
  },

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
