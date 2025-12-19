import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrefsControls from '../components/PrefsControls'
import { apiFetch } from '../api/client'
import { usePrefsStore } from '../store/prefsStore'

export default function Setup({ mode = 'login' }) {
  const navigate = useNavigate()

  const role = usePrefsStore((s) => s.role)
  const setRole = usePrefsStore((s) => s.setRole)
  const setClientId = usePrefsStore((s) => s.setClientId)

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  async function submit() {
    const phoneValue = phone.trim()
    setError('')

    if (!phoneValue) {
      setError('Please enter your phone number.')
      return
    }

    setLoading(true)
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const body = isSignup ? { phone: phoneValue, role } : { phone: phoneValue }

      const data = await apiFetch(endpoint, { method: 'POST', body })
      const user = data.user

      // Use server user id as clientId so ownership (ownerId) works across devices.
      setClientId(user?._id || user?.id)
      if (user?.role) setRole(user.role)

      navigate('/', { replace: true })
    } catch (e) {
      setError(e?.payload?.error || e?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{isSignup ? 'Signup' : 'Login'}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your phone number, then choose role, language, and optionally enable location.
      </p>

      {error ? <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      <div className="mt-5 grid gap-3 sm:max-w-lg">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Phone</span>
          <input
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="e.g., +91 98765 43210"
          />
        </label>

        <PrefsControls variant="card" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Login'}
        </button>
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => navigate('/jobs')}
        >
          Browse jobs
        </button>
      </div>
    </div>
  )
}
