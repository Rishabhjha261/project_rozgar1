export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
]

export function isSupportedLanguage(code) {
  return LANGUAGES.some((l) => l.code === code)
}

// ✅ NEW: safe language resolver
export function getSafeLanguage() {
  // 1️⃣ User-selected language (highest priority)
  const stored = localStorage.getItem('lang')
  if (stored && isSupportedLanguage(stored)) {
    return stored
  }

  // 2️⃣ Browser language (normalize en-IN → en)
  const browserLang = navigator.language?.split('-')[0]
  if (browserLang && isSupportedLanguage(browserLang)) {
    return browserLang
  }

  // 3️⃣ Default fallback
  return 'en'
}
