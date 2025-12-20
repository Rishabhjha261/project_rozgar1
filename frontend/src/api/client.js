import { usePrefsStore } from '../store/prefsStore'

const DEFAULT_BASE = 'https://project-rozgar-backend.onrender.com'
const REQUEST_TIMEOUT = 20000 // 20 sec (Render cold start safe)

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
}

export async function apiFetch(
  path,
  { method = 'GET', body, query } = {}
) {
  const baseUrl = getApiBaseUrl()
  const safePath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(baseUrl + safePath)

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }

  const prefs = usePrefsStore.getState()

  // ✅ AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

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
      signal: controller.signal,
    })
  } catch (error) {
    clearTimeout(timeoutId)

    const err = new Error(
      error.name === 'AbortError'
        ? 'request_timeout'
        : 'network_error'
    )
    err.status = 0
    err.payload = error
    throw err
  }

  clearTimeout(timeoutId)

  let json = {}
  try {
    json = await res.json()
  } catch {
    // non-JSON response safe ignore
  }

  if (!res.ok) {
    const err = new Error(json?.error || 'request_failed')
    err.status = res.status
    err.payload = json
    throw err
  }

  return json
}
