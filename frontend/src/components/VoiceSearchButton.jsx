import { useEffect, useMemo, useRef, useState } from 'react'
import { createVoiceRecognizer, isVoiceSearchSupported } from '../utils/speech'

export default function VoiceSearchButton({ language, onPartial, onFinal, onText }) {
  const supported = useMemo(() => isVoiceSearchSupported(), [])
  const sessionRef = useRef(null)

  // Backwards-compat: some call sites pass `onText` instead of `onFinal`.
  const handleFinal = onFinal || onText

  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      try {
        sessionRef.current?.stop?.()
      } catch {
        // ignore
      }
    }
  }, [])

  if (!supported) return null

  return (
    <div className="grid gap-1">
      <button
        type="button"
        className={
          listening
            ? 'h-11 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white'
            : 'h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50'
        }
        aria-label="Voice search"
        onClick={() => {
          setError('')

          // toggle off
          if (listening) {
            try {
              sessionRef.current?.stop?.()
            } catch {
              // ignore
            }
            setListening(false)
            return
          }

          const session = createVoiceRecognizer({
            language,
            onPartial: (text) => onPartial?.(text),
            onFinal: (text) => {
              handleFinal?.(text)
              setListening(false)
            },
            onError: () => {
              setError('Voice search failed. Please try again.')
              setListening(false)
            },
          })

          if (!session) {
            setError('Voice search not supported in this browser.')
            return
          }

          sessionRef.current = session
          setListening(true)

          try {
            session.start()
          } catch {
            setError('Voice search failed. Please try again.')
            setListening(false)
          }
        }}
      >
        {listening ? '🎙️ Listening…' : '🎙️ Speak'}
      </button>
      {error ? <div className="text-[11px] text-rose-600">{error}</div> : null}
    </div>
  )
}
