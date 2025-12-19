function getSpeechRecognition() {
  const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
  return SpeechRecognition || null
}

export function isVoiceSearchSupported() {
  return Boolean(getSpeechRecognition())
}

export function languageToSpeechLocale(lang) {
  switch (lang) {
    case 'hi':
      return 'hi-IN'
    case 'te':
      return 'te-IN'
    case 'bn':
      return 'bn-IN'
    case 'mr':
      return 'mr-IN'
    case 'en':
    default:
      return 'en-IN'
  }
}

export function createVoiceRecognizer({ language, onPartial, onFinal, onError }) {
  const SR = getSpeechRecognition()
  if (!SR) return null

  const recognition = new SR()
  recognition.lang = languageToSpeechLocale(language)
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    try {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        const text = r?.[0]?.transcript || ''
        if (r.isFinal) final += text
        else interim += text
      }

      if (interim && onPartial) onPartial(interim.trim())
      if (final && onFinal) onFinal(final.trim())
    } catch (e) {
      onError?.(e)
    }
  }

  recognition.onerror = (event) => {
    onError?.(new Error(event?.error || 'speech_error'))
  }

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  }
}
