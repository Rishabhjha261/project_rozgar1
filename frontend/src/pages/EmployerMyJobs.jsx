import { useEffect, useMemo } from 'react'
import JobCard from '../components/JobCard'
import { useJobsStore } from '../store/jobsStore'
import { usePrefsStore } from '../store/prefsStore'

export default function EmployerMyJobs() {
  const ownerId = usePrefsStore((s) => s.clientId)

  const jobs = useJobsStore((s) => s.jobs)
  const status = useJobsStore((s) => s.status)
  const error = useJobsStore((s) => s.error)
  const fetchJobs = useJobsStore((s) => s.fetchJobs)

  useEffect(() => {
    if (!ownerId) return
    fetchJobs({ ownerId, includeHidden: true })
  }, [fetchJobs, ownerId])

  const myJobs = useMemo(() => {
    return (jobs || []).filter((j) => j.ownerId === ownerId)
  }, [jobs, ownerId])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">My Jobs (Employer)</h1>
      <p className="mt-2 text-sm text-slate-600">Jobs posted from your employer account.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'loading' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading…</div>
        ) : status === 'error' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to load jobs. {error?.message ? `(${error.message})` : ''}
          </div>
        ) : myJobs.length ? (
          myJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No posted jobs yet. Go to “Post Job”.
          </div>
        )}
      </div>
    </div>
  )
}
