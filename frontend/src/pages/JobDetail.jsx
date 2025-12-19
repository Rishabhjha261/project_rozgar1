import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCategory } from '../data/categories'
import { useT } from '../i18n/useT'
import { translateText } from '../i18n/translate'
import { useJobsStore } from '../store/jobsStore'
import { usePrefsStore } from '../store/prefsStore'
import { useReportsStore } from '../store/reportsStore'
import { distanceKm, formatKm } from '../utils/geo'

function digitsOnly(phone) {
  return String(phone || '').replace(/\D/g, '')
}

export default function JobDetail() {
  const { t, language } = useT()
  const { jobId } = useParams()
  const navigate = useNavigate()

  const job = useJobsStore((s) => s.getJobById(jobId))
  const fetchJobById = useJobsStore((s) => s.fetchJobById)
  const savedJobIds = useJobsStore((s) => s.savedJobIds)
  const toggleSaved = useJobsStore((s) => s.toggleSaved)

  const [loadingJob, setLoadingJob] = useState(false)
  const [jobLoadError, setJobLoadError] = useState('')

  const addReport = useReportsStore((s) => s.addReport)

  const location = usePrefsStore((s) => s.location)
  const autoTranslateDynamic = usePrefsStore((s) => s.autoTranslateDynamic)

  const [openReport, setOpenReport] = useState(false)
  const [reason, setReason] = useState('report.fake')
  const [notes, setNotes] = useState('')
  const [reported, setReported] = useState(false)
  const [titleTranslated, setTitleTranslated] = useState('')

  const category = useMemo(() => getCategory(job?.category), [job?.category])

  const isSaved = job ? savedJobIds.includes(job.id) : false

  const distanceLabel = (() => {
    if (!job?.geo || !location) return ''
    const km = distanceKm(location, job.geo)
    return km == null ? '' : formatKm(km)
  })()

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!jobId) return
      if (job) return

      setLoadingJob(true)
      setJobLoadError('')

      const fetched = await fetchJobById(jobId)
      if (cancelled) return

      if (!fetched) setJobLoadError('not_found')
      setLoadingJob(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [fetchJobById, job, jobId])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!job) return
      if (!autoTranslateDynamic || language === 'en') {
        setTitleTranslated('')
        return
      }
      const translated = await translateText(job.title, language)
      if (!cancelled) setTitleTranslated(translated)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [autoTranslateDynamic, job, language])

  if (!job) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">
          {loadingJob ? 'Loading job…' : 'Job not found'}
        </h1>
        {jobLoadError ? (
          <p className="mt-2 text-sm text-slate-600">{jobLoadError}</p>
        ) : null}
        <button
          className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
          onClick={() => navigate('/jobs')}
        >
          Back to jobs
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6">
      <button className="text-sm font-semibold text-slate-700" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
            {category?.icon || '💼'}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-slate-900">{titleTranslated || job.title}</h1>
            <div className="mt-1 text-sm text-slate-600">{job.area}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1">₹{job.salaryMin}–{job.salaryMax}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{job.shift}</span>
              {distanceLabel ? <span className="rounded-full bg-slate-100 px-3 py-1">{distanceLabel}</span> : null}
              {job.verified ? (
                <span className="rounded-full bg-emerald-600 px-3 py-1 font-semibold text-white">Verified</span>
              ) : (
                <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700">Unverified</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Pay</div>
            <div className="mt-1 text-sm font-bold text-slate-900">₹{job.salaryMin}–{job.salaryMax}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Shift</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{job.shift}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">Trust</div>
            <div className="mt-1 text-sm font-bold text-slate-900">
              {job.verified ? 'Verified' : 'Not verified'}
              {typeof job.rating === 'number' ? ` • ⭐ ${job.rating.toFixed(1)}` : ''}
            </div>
          </div>
        </div>

        <div className="mt-5 text-sm text-slate-600">
          Contact the employer directly. If something looks suspicious, please report the listing.
        </div>

        {reported ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
            Thanks — report submitted.
          </div>
        ) : null}
      </div>

      {/* Bottom CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 px-4 py-3">
          <a
            className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
            href={`tel:${job.contact.phone}`}
          >
            📞 {t('common.call')}
          </a>
          <a
            className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white"
            href={`https://wa.me/${digitsOnly(job.contact.whatsapp || job.contact.phone)}`}
            target="_blank"
            rel="noreferrer"
          >
            💬 {t('common.whatsapp')}
          </a>
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            onClick={() => toggleSaved(job.id)}
          >
            {isSaved ? '★ ' + t('common.saved') : '☆ ' + t('common.save')}
          </button>
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            onClick={() => setOpenReport(true)}
          >
            ⚠️ {t('common.report')}
          </button>
        </div>
      </div>

      {/* Report modal */}
      {openReport ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl">
            <div className="text-base font-bold text-slate-900">Report job</div>
            <div className="mt-1 text-sm text-slate-600">Help us keep the platform safe.</div>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-700">{t('report.reason')}</span>
                <select
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="report.fake">{t('report.fake')}</option>
                  <option value="report.noSalary">{t('report.noSalary')}</option>
                  <option value="report.badBehavior">{t('report.badBehavior')}</option>
                  <option value="report.other">{t('report.other')}</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-700">Notes (optional)</span>
                <textarea
                  className="min-h-24 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What went wrong?"
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  onClick={async () => {
                    try {
                      await addReport({ jobId: job.id, reason, notes })
                      setReported(true)
                      setOpenReport(false)
                    } catch {
                      // ignore for prototype UI
                    }
                  }}
                >
                  {t('common.submit')}
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                  onClick={() => setOpenReport(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
