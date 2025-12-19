import { useMemo } from 'react'
import { DICTIONARY } from './dictionary'
import { usePrefsStore } from '../store/prefsStore'

export function useT() {
  const language = usePrefsStore((s) => s.language)

  return useMemo(() => {
    const dict = DICTIONARY[language] || DICTIONARY.en

    function t(key) {
      return dict[key] || DICTIONARY.en[key] || key
    }

    return { t, language }
  }, [language])
}
