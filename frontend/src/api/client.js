import { usePrefsStore } from '../store/prefsStore'

const DEFAULT_BASE = 'https://project-rozgar-backend.onrender.com'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
}

export async function apiFetch(path, { method = 'GET', body, query } = {}) {
  const baseUrl = getApiBaseUrl()
  const url = new URL(baseUrl + path)

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }

  const prefs = usePrefsStore.getState()

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-role': prefs.role,
      'x-client-id': prefs.clientId,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(json?.error || 'request_failed')
    err.status = res.status
    err.payload = json
    throw err
  }

  return json
}
