import { useMemo } from 'react'
import { DICTIONARY } from './dictionary'
import { usePrefsStore } from '../store/prefsStore'
import { getSafeLanguage } from './languages'

export function useT() {
  const storeLang = usePrefsStore((s) => s.language)

  const language = useMemo(() => {
    // 1️⃣ Normalize (hi-IN → hi)
    const normalized = storeLang?.split('-')[0]

    // 2️⃣ Validate against dictionary
    if (normalized && DICTIONARY[normalized]) {
      return normalized
    }

    // 3️⃣ Fallback to safe detection
    return getSafeLanguage()
  }, [storeLang])

  return useMemo(() => {
    const dict = DICTIONARY[language] || DICTIONARY.en

    function t(key) {
      return dict[key] || DICTIONARY.en[key] || key
    }

    return { t, language }
  }, [language])
}

