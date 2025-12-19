import { create } from 'zustand'
import { getCurrentPosition } from '../utils/geo'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'
import { isSupportedLanguage } from '../i18n/languages'

const PREFS_VERSION = 2 // reset old persisted prefs safely

const DEFAULT_PREFS = {
  version: PREFS_VERSION,
  role: 'employee',
  language: 'en', // English first
  location: null, // { lat, lng, accuracy, timestamp }
  locationStatus: 'idle', // idle | requesting | granted | denied | error
  autoTranslateDynamic: true,
  clientId: null,
}

function newId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `cid_${Date.now()}_${Math.random().toString(16).slice(2)}`
  )
}

function loadPrefs() {
  const stored = readJSON(STORAGE_KEYS.prefs, null)

  // Reset old versions → enforce English + clean state
  if (!stored || stored.version !== PREFS_VERSION) {
    return {
      ...DEFAULT_PREFS,
      clientId: stored?.clientId || newId(),
    }
  }

  const base = { ...DEFAULT_PREFS, ...stored }

  return {
    ...base,
    language: isSupportedLanguage(base.language) ? base.language : 'en',
    clientId: base.clientId || newId(),
  }
}

function persist(next) {
  writeJSON(STORAGE_KEYS.prefs, {
    version: PREFS_VERSION,
    role: next.role,
    language: next.language,
    location: next.location,
    locationStatus: next.locationStatus,
    autoTranslateDynamic: next.autoTranslateDynamic,
    clientId: next.clientId,
  })
}

export const usePrefsStore = create((set, get) => {
  const initial = loadPrefs()

  return {
    ...initial,

    setRole: (role) =>
      set((s) => {
        const next = { ...s, role }
        persist(next)
        return next
      }),

    setClientId: (clientId) =>
      set((s) => {
        const next = { ...s, clientId: clientId || newId() }
        persist(next)
        return next
      }),

    setLanguage: (language) =>
      set((s) => {
        const safe = isSupportedLanguage(language) ? language : 'en'
        const next = { ...s, language: safe }
        persist(next)
        return next
      }),

    setAutoTranslateDynamic: (value) =>
      set((s) => {
        const next = { ...s, autoTranslateDynamic: Boolean(value) }
        persist(next)
        return next
      }),

    // ✅ FIXED LOCATION HANDLING (PRODUCTION SAFE)
    requestLocation: async () => {
      const currentStatus = get().locationStatus
      if (currentStatus === 'requesting') return

      // Start request
      set((s) => {
        const next = { ...s, locationStatus: 'requesting' }
        persist(next)
        return next
      })

      try {
        const loc = await getCurrentPosition()

        set((s) => {
          const next = {
            ...s,
            location: loc,
            locationStatus: 'granted',
          }
          persist(next)
          return next
        })
      } catch (err) {
        const denied = err?.code === 1 // permission denied

        set((s) => {
          const next = {
            ...s,
            location: null, // clear stale location
            locationStatus: denied ? 'denied' : 'error',
          }
          persist(next)
          return next
        })
      }
    },

    clearLocation: () =>
      set((s) => {
        const next = {
          ...s,
          location: null,
          locationStatus: 'idle',
        }
        persist(next)
        return next
      }),
  }
})
