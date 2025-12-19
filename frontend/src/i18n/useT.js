import { useMemo } from 'react'
import { DICTIONARY } from './dictionary'
import { usePrefsStore } from '../store/prefsStore'
import { isSupportedLanguage } from './languages'

export function useT() {
  const language = usePrefsStore((s) => s.language)

  const safeLang = useMemo(() => {
    const normalized = language?.split('-')[0]
    return isSupportedLanguage(normalized) ? normalized : 'en'
  }, [language])

  return useMemo(() => {
    const dict = DICTIONARY[safeLang] || DICTIONARY.en

    function t(key) {
      return dict[key] || DICTIONARY.en[key] || key
    }

    return { t, language: safeLang }
  }, [safeLang])
}
