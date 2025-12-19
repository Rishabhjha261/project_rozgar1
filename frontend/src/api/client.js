import { usePrefsStore } from '../store/prefsStore'

const DEFAULT_BASE = 'https://project-rozgar-backend.onrender.com'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
}

export async function apiFetch(
  path,
  { method = 'GET', body, query } = {}
) {
  const baseUrl = getApiBaseUrl()

  // ✅ FIX: ensure correct URL joining
  const safePath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(baseUrl + safePath)

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }

  const prefs = usePrefsStore.getState()

  let res
  try {
    res = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-role': prefs.role || '',
        'x-client-id': prefs.clientId || '',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    // ✅ Network / CORS / DNS failure
    const err = new Error('network_error')
    err.status = 0
    err.payload = networkError
    throw err
  }

  let json = {}
  try {
    json = await res.json()
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    // ✅ Proper error with HTTP status
    const err = new Error(json?.error || 'request_failed')
    err.status = res.status
    err.payload = json
    throw err
  }

  return json
}
