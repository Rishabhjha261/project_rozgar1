import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import JobCard from '../components/JobCard'
import VoiceSearchButton from '../components/VoiceSearchButton'
import { CATEGORIES, getCategory } from '../data/categories'
import { useT } from '../i18n/useT'
import { translateText } from '../i18n/translate'
import { useJobsStore } from '../store/jobsStore'
import { usePrefsStore } from '../store/prefsStore'
import { distanceKm, formatKm } from '../utils/geo'

export default function Jobs() {
  const { t, language } = useT()
  const [params, setParams] = useSearchParams()

  const categoryKey = params.get('category') || ''

  const location = usePrefsStore((s) => s.location)
  const locationStatus = usePrefsStore((s) => s.locationStatus)
  const requestLocation = usePrefsStore((s) => s.requestLocation)
  const autoTranslateDynamic = usePrefsStore((s) => s.autoTranslateDynamic)

  const jobs = useJobsStore((s) => s.jobs)
  const status = useJobsStore((s) => s.status)
  const error = useJobsStore((s) => s.error)
  const fetchJobs = useJobsStore((s) => s.fetchJobs)
  const savedJobIds = useJobsStore((s) => s.savedJobIds)

  useEffect(() => {
    fetchJobs({ category: categoryKey || undefined })
  }, [fetchJobs, categoryKey])

  const visibleJobs = useMemo(() => {
    return (jobs || []).filter((j) => !j.hidden)
  }, [jobs])

  const [query, setQuery] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [titleById, setTitleById] = useState({})

  const category = useMemo(() => getCategory(categoryKey), [categoryKey])

  // ✅ FIXED LOCATION-BASED SORTING
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()

    let list = visibleJobs

    if (categoryKey) list = list.filter((j) => j.category === categoryKey)
    if (savedOnly) {
      const saved = new Set(savedJobIds)
      list = list.filter((j) => saved.has(j.id))
    }
    if (q) {
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.area.toLowerCase().includes(q)
      )
    }

    const withDistance = list.map((j) => {
      if (!location) return { job: j, km: null }

      // ✅ normalize job coordinates
      const jobLoc =
        j.geo ||
        j.location ||
        (j.lat != null && j.lng != null
          ? { lat: j.lat, lng: j.lng }
          : null)

      const km =
        jobLoc && jobLoc.lat != null && jobLoc.lng != null
          ? distanceKm(location, jobLoc)
          : null

      return { job: j, km }
    })

    withDistance.sort((a, b) => {
      if (a.km != null && b.km != null) return a.km - b.km
      if (a.km != null) return -1
      if (b.km != null) return 1
      return (b.job.createdAt || 0) - (a.job.createdAt || 0)
    })

    return withDistance
  }, [categoryKey, location, query, savedJobIds, savedOnly, visibleJobs])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!autoTranslateDynamic || language === 'en') {
        setTitleById({})
        return
      }

      const entries = await Promise.all(
        filteredJobs.slice(0, 50).map(async ({ job }) => {
          const translated = await translateText(job.title, language)
          return [job.id, translated]
        })
      )

      if (!cancelled) setTitleById(Object.fromEntries(entries))
    }

    run()
    return () => {
      cancelled = true
    }
  }, [autoTranslateDynamic, filteredJobs, language])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('jobs.title')}
          </h1>
          <div className="mt-1 text-sm text-slate-600">
            {category ? (
              <>
                Category:{' '}
                <span className="font-semibold">
                  {t(category.labelKey)}
                </span>
              </>
            ) : (
              t('jobs.sortingNote')
            )}
          </div>
        </div>

        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          onClick={requestLocation}
        >
          {location ? '📍 Location on' : '📍 ' + t('common.enableLocation')}
          {locationStatus === 'requesting' ? '…' : ''}
        </button>
      </div>

      <div className="mt-4 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-slate-700">
            {t('common.search')}
          </span>
          <div className="flex gap-2">
            <input
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
            />
            <VoiceSearchButton
              language={language}
              onText={(text) => setQuery(text)}
            />
          </div>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">
            Category
          </span>
          <select
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={categoryKey}
            onChange={(e) => {
              const next = e.target.value
              const p = new URLSearchParams(params)
              if (next) p.set('category', next)
              else p.delete('category')
              setParams(p, { replace: true })
            }}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {t(c.labelKey)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2 md:col-span-3">
          <button
            type="button"
            className={
              savedOnly
                ? 'rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900'
            }
            onClick={() => setSavedOnly((v) => !v)}
          >
            ★ {savedOnly ? t('common.saved') : t('common.save')}
          </button>

          {categoryKey && (
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              onClick={() => {
                const p = new URLSearchParams(params)
                p.delete('category')
                setParams(p, { replace: true })
              }}
            >
              Clear category
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'loading' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Loading…
          </div>
        ) : status === 'error' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to load jobs.
            {error?.message ? ` (${error.message})` : ''}
          </div>
        ) : filteredJobs.length ? (
          filteredJobs.map(({ job, km }) => (
            <JobCard
              key={job.id}
              job={job}
              title={titleById[job.id] || job.title}
              distanceLabel={km == null ? '' : formatKm(km)}
              isSaved={savedJobIds.includes(job.id)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            {t('jobs.noResults')}
          </div>
        )}
      </div>
    </div>
  )
}
