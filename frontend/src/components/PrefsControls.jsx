import { LANGUAGES } from '../i18n/languages'
import { useT } from '../i18n/useT'
import { usePrefsStore } from '../store/prefsStore'

const ROLES = [
  { key: 'employer', labelKey: 'role.employer' },
  { key: 'employee', labelKey: 'role.employee' },
  { key: 'admin', labelKey: 'role.admin' },
]

export default function PrefsControls({ variant = 'inline' }) {
  const { t } = useT()
  const role = usePrefsStore((s) => s.role)
  const language = usePrefsStore((s) => s.language)
  const locationStatus = usePrefsStore((s) => s.locationStatus)
  const location = usePrefsStore((s) => s.location)
  const setRole = usePrefsStore((s) => s.setRole)
  const setLanguage = usePrefsStore((s) => s.setLanguage)
  const requestLocation = usePrefsStore((s) => s.requestLocation)

  const wrapClass =
    variant === 'card' ? 'grid gap-3 rounded-2xl border border-slate-200 bg-white p-4' : 'flex flex-wrap gap-2'

  return (
    <div className={wrapClass}>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Role</span>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.key} value={r.key}>
              {t(r.labelKey)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Language</span>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid content-end">
        <button
          type="button"
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={requestLocation}
        >
          {location ? '📍 Location on' : '📍 ' + t('common.enableLocation')}
          {locationStatus === 'requesting' ? '…' : ''}
        </button>
        {locationStatus === 'denied' ? (
          <div className="mt-1 text-[11px] text-rose-600">Location denied in browser settings.</div>
        ) : null}
      </div>
    </div>
  )
}
