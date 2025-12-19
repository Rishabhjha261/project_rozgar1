import { Link } from 'react-router-dom'
import { getCategory } from '../data/categories'

export default function JobCard({ job, distanceLabel, title, isSaved = false }) {
  const category = getCategory(job.category)

  return (
    <Link
      to={`/jobs/${encodeURIComponent(job.id)}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
          {category?.icon || '💼'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{title || job.title}</div>
            <div className="flex-none text-base leading-none text-amber-500">{isSaved ? '★' : ''}</div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2 py-1">₹{job.salaryMin}–{job.salaryMax}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">{job.shift}</span>
            {distanceLabel ? <span className="rounded-full bg-slate-100 px-2 py-1">{distanceLabel}</span> : null}
          </div>
          <div className="mt-2 text-xs text-slate-500">{job.area}</div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {job.verified ? (
            <span className="rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white">
              Verified
            </span>
          ) : (
            <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
              Unverified
            </span>
          )}
          {typeof job.rating === 'number' ? (
            <span className="text-xs text-slate-600">⭐ {job.rating.toFixed(1)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
