import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import { useT } from '../i18n/useT'
import { useJobsStore } from '../store/jobsStore'
import { usePrefsStore } from '../store/prefsStore'

function toInt(v) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0
}

export default function EmployerPostJob() {
  const { t } = useT()
  const navigate = useNavigate()
  const createJob = useJobsStore((s) => s.createJob)

  const location = usePrefsStore((s) => s.location)
  const locationStatus = usePrefsStore((s) => s.locationStatus)
  const requestLocation = usePrefsStore((s) => s.requestLocation)

  const [category, setCategory] = useState('maid')
  const [title, setTitle] = useState('')
  const [area, setArea] = useState('')
  const [shift, setShift] = useState('Day')
  const [salaryMin, setSalaryMin] = useState('12000')
  const [salaryMax, setSalaryMax] = useState('16000')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [latManual, setLatManual] = useState('')
  const [lngManual, setLngManual] = useState('')
  const [error, setError] = useState('')

  const geo = useMemo(() => {
    if (location) return { lat: location.lat, lng: location.lng }
    const lat = Number(latManual)
    const lng = Number(lngManual)
    if (Number.isFinite(lat) && Number.isFinite(lng) && String(latManual).trim() && String(lngManual).trim()) {
      return { lat, lng }
    }
    return null
  }, [latManual, lngManual, location])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Post a job (Employer)</h1>
      <p className="mt-2 text-sm text-slate-600">Create a job posting (stored in MongoDB via the backend).</p>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Category</span>
            <select
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {t(c.labelKey)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Shift</span>
            <select
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option>Day</option>
              <option>Night</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Full Day</option>
              <option>Flexible</option>
            </select>
          </label>

          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Job title</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Driver for office pickup/drop"
            />
          </label>

          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Area</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., Andheri West, Mumbai"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Salary min (₹)</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              inputMode="numeric"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Salary max (₹)</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              inputMode="numeric"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Phone</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91..."
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">WhatsApp (optional)</span>
            <input
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91..."
            />
          </label>

          <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">Location</div>
                <div className="mt-1 text-xs text-slate-600">
                  {geo ? `lat ${geo.lat.toFixed(4)}, lng ${geo.lng.toFixed(4)}` : 'Add location to enable nearby sorting'}
                </div>
              </div>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                onClick={requestLocation}
              >
                {locationStatus === 'requesting' ? 'Getting…' : 'Use my location'}
              </button>
            </div>

            {!location ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-700">Latitude (manual)</span>
                  <input
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                    value={latManual}
                    onChange={(e) => setLatManual(e.target.value)}
                    placeholder="e.g., 19.076"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-700">Longitude (manual)</span>
                  <input
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                    value={lngManual}
                    onChange={(e) => setLngManual(e.target.value)}
                    placeholder="e.g., 72.877"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            onClick={async () => {
              setError('')
              if (!title.trim()) return setError('Please enter a job title.')
              if (!area.trim()) return setError('Please enter an area.')
              const sMin = toInt(salaryMin)
              const sMax = toInt(salaryMax)
              if (!sMin || !sMax || sMax < sMin) return setError('Please enter a valid salary range.')
              if (!phone.trim()) return setError('Please enter a phone number.')
              if (!geo) return setError('Please enable location or enter manual lat/lng.')

              try {
                await createJob({
                  category,
                  title: title.trim(),
                  area: area.trim(),
                  lat: geo.lat,
                  lng: geo.lng,
                  salaryMin: sMin,
                  salaryMax: sMax,
                  shift,
                  phone: phone.trim(),
                  whatsapp: (whatsapp || phone).trim(),
                })

                navigate('/employer/my-jobs')
              } catch (e) {
                setError(e?.message || 'Failed to post job.')
              }
            }}
          >
            Post job
          </button>
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
