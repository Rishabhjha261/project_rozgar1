export const STORAGE_KEYS = {
  prefs: 'rozgar:prefs',
  postedJobs: 'rozgar:postedJobs',
  savedJobIds: 'rozgar:savedJobIds',
  hiddenJobIds: 'rozgar:hiddenJobIds',
  reports: 'rozgar:reports',
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / private mode issues in prototype
  }
}

export function updateJSON(key, fallback, updater) {
  const current = readJSON(key, fallback)
  const next = updater(current)
  writeJSON(key, next)
  return next
}
