import { create } from 'zustand'
import { getCurrentPosition } from '../utils/geo'
import { readJSON, STORAGE_KEYS, writeJSON } from '../utils/storage'
import { isSupportedLanguage } from '../i18n/languages'

const DEFAULT_PREFS = {
  role: 'employee',
  language: 'en',
  location: null, // {lat,lng,accuracy,timestamp}
  locationStatus: 'idle', // idle | requesting | granted | denied | error
  autoTranslateDynamic: true,
  clientId: null,
}

function newId() {
  return globalThis.crypto?.randomUUID?.() || `cid_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function loadPrefs() {
  const stored = readJSON(STORAGE_KEYS.prefs, null)
  const base = stored ? { ...DEFAULT_PREFS, ...stored } : { ...DEFAULT_PREFS }

  return {
    ...base,
    language: isSupportedLanguage(base.language) ? base.language : 'en',
    clientId: base.clientId || newId(),
  }
}

function persist(next) {
  writeJSON(STORAGE_KEYS.prefs, {
    role: next.role,
    language: next.language,
    location: next.location,
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
        const next = { ...s, language: isSupportedLanguage(language) ? language : 'en' }
        persist(next)
        return next
      }),

    setAutoTranslateDynamic: (value) =>
      set((s) => {
        const next = { ...s, autoTranslateDynamic: Boolean(value) }
        persist(next)
        return next
      }),

    requestLocation: async () => {
      const currentStatus = get().locationStatus
      if (currentStatus === 'requesting') return

      set({ locationStatus: 'requesting' })
      try {
        const loc = await getCurrentPosition()
        set((s) => {
          const next = { ...s, location: loc, locationStatus: 'granted' }
          persist(next)
          return next
        })
      } catch (err) {
        const denied = err?.code === 1
        set({ locationStatus: denied ? 'denied' : 'error' })
      }
    },

    clearLocation: () =>
      set((s) => {
        const next = { ...s, location: null, locationStatus: 'idle' }
        persist(next)
        return next
      }),
  }
})
