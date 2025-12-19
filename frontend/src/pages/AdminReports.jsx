import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n/useT'
import { useJobsStore } from '../store/jobsStore'
import { useReportsStore } from '../store/reportsStore'

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ''
  }
}

export default function AdminReports() {
  const { t } = useT()
  const [tab, setTab] = useState('open')

  // ✅ PER-JOB loading state (IMPORTANT)
  const [updatingJobs, setUpdatingJobs] = useState(() => new Set())

  const reports = useReportsStore((s) => s.reports)
  const reportsStatus = useReportsStore((s) => s.status)
  const reportsError = useReportsStore((s) => s.error)
  const fetchReports = useReportsStore((s) => s.fetchReports)
  const resolveReport = useReportsStore((s) => s.resolveReport)

  const getJobById = useJobsStore((s) => s.getJobById)
  const fetchJobById = useJobsStore((s) => s.fetchJobById)
  const hideJob = useJobsStore((s) => s.hideJob)
  const unhideJob = useJobsStore((s) => s.unhideJob)

  useEffect(() => {
    fetchReports({ status: tab })
  }, [fetchReports, tab])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const ids = Array.from(
        new Set((reports || []).map((r) => r.jobId))
      ).filter(Boolean)

      const missing = ids.filter((id) => !getJobById(id))

      for (const id of missing) {
        if (cancelled) return
        await fetchJobById(id)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [fetchJobById, getJobById, reports])

  const filtered = useMemo(
    () => reports.filter((r) => r.status === tab),
    [reports, tab]
  )

  // ✅ helpers
  const startUpdating = (jobId) =>
    setUpdatingJobs((s) => new Set(s).add(jobId))

  const stopUpdating = (jobId) =>
    setUpdatingJobs((s) => {
      const next = new Set(s)
      next.delete(jobId)
      return next
    })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Reports</h1>
      <p className="mt-2 text-sm text-slate-600">
        Review reports submitted by users.
      </p>

      <div className="mt-5 flex gap-2">
        {['open', 'resolved'].map((k) => (
          <button
            key={k}
            className={
              tab === k
                ? 'rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800'
            }
            onClick={() => setTab(k)}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {reportsStatus === 'loading' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            Loading…
          </div>
        ) : reportsStatus === 'error' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to load reports
            {reportsError?.message ? ` (${reportsError.message})` : ''}
          </div>
        ) : filtered.length ? (
          filtered.map((r) => {
            const job = getJobById(r.jobId)
            const isHidden = Boolean(job?.hidden)
            const isUpdating = job && updatingJobs.has(job.id)

            return (
              <div
                key={r.id}
                className="rounded-3xl border border-slate-200 bg-white p-5"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold">Report</div>
                    <div className="text-xs text-slate-500">
                      {formatTime(r.createdAt)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {tab === 'open' && (
                      <button
                        className="rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white"
                        onClick={() => resolveReport(r.id)}
                      >
                        Resolve
                      </button>
                    )}

                    {job && (
                      <button
                        disabled={isUpdating}
                        className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                          isUpdating
                            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'border border-slate-200 bg-white text-slate-900'
                        }`}
                        onClick={async () => {
                          startUpdating(job.id)
                          try {
                            if (isHidden) {
                              await unhideJob(job.id)
                            } else {
                              await hideJob(job.id)
                            }
                          } finally {
                            stopUpdating(job.id) // ✅ ALWAYS runs
                          }
                        }}
                      >
                        {isUpdating
                          ? isHidden
                            ? 'Unhiding…'
                            : 'Hiding…'
                          : isHidden
                          ? 'Unhide job'
                          : 'Hide job'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <strong>Reason:</strong> {t(r.reason) || r.reason}
                </div>

                {job && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-xs text-slate-600">{job.area}</div>
                    <Link
                      className="mt-2 inline-block text-sm text-emerald-700"
                      to={`/jobs/${encodeURIComponent(job.id)}`}
                    >
                      View job →
                    </Link>
                    {isHidden && (
                      <div className="mt-2 text-xs text-rose-600">
                        Currently hidden from users
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            No {tab} reports.
          </div>
        )}
      </div>
    </div>
  )
}
