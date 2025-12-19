import { create } from 'zustand'
import { apiFetch } from '../api/client'

function normalizeReport(doc) {
  if (!doc) return null

  return {
    id: String(doc._id || doc.id),
    jobId: String(doc.jobId),
    reason: String(doc.reason || ''),
    notes: String(doc.notes || ''),
    status: String(doc.status || 'open'),
    reporterId: doc.reporterId || null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).getTime() : Date.now(),
  }
}

export const useReportsStore = create((set) => ({
  reports: [],
  status: 'idle',
  error: null,

  fetchReports: async ({ status } = {}) => {
    set({ status: 'loading', error: null })
    try {
      const data = await apiFetch('/api/reports', { query: { status } })
      const reports = (data.reports || []).map(normalizeReport).filter(Boolean)
      set({ reports, status: 'ready' })
      return reports
    } catch (e) {
      set({ status: 'error', error: e })
      return []
    }
  },

  addReport: async ({ jobId, reason, notes }) => {
    const data = await apiFetch('/api/reports', { method: 'POST', body: { jobId, reason, notes } })
    const created = normalizeReport(data.report)
    set((s) => ({ reports: [created, ...s.reports] }))
    return created
  },

  resolveReport: async (reportId) => {
    const data = await apiFetch(`/api/reports/${encodeURIComponent(reportId)}/resolve`, { method: 'PATCH' })
    const updated = normalizeReport(data.report)
    set((s) => ({ reports: s.reports.map((r) => (r.id === updated.id ? updated : r)) }))
    return updated
  },
}))
