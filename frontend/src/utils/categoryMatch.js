import { CATEGORIES } from '../data/categories'

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Includes some common Hindi/Marathi/English transliterations used in speech.
const SYNONYMS = {
  maid: ['maid', 'मेड', 'मेड्स', 'house maid', 'घर की मेड', 'domestic help', 'कामवाली', 'घरकामवाली'],
  driver: ['driver', 'ड्राइवर', 'ड्रायव्हर', 'డ్రైవర్', 'ড্রাইভার'],
  delivery: ['delivery', 'डिलीवरी', 'డెలివరీ', 'ডেলিভারি', 'डिलिव्हरी'],
  security_guard: ['security', 'security guard', 'guard', 'गार्ड', 'सिक्योरिटी', 'సెక్యూరిటీ', 'সিকিউরিটি'],
  electrician: ['electrician', 'इलेक्ट्रीशियन', 'ఎలక్ట్రిషియన్', 'ইলেক্ট্রিশিয়ান'],
  plumber: ['plumber', 'प्लंबर', 'ప్లంబర్', 'প্লাম্বার'],
  labour: ['labour', 'labor', 'मजदूर', 'मजूर', 'mazdoor', 'कूल', 'कुली', 'కూలీ', 'মজুর'],
  waiter: ['waiter', 'वेटर', 'वे이터', 'వెయిటర్', 'ওয়েটার', 'restaurant waiter'],
}

export function detectCategoryKeyFromText(text) {
  const t = normalize(text)
  if (!t) return null

  // direct key match
  for (const c of CATEGORIES) {
    if (t.includes(c.key)) return c.key
  }

  // synonyms
  for (const [key, list] of Object.entries(SYNONYMS)) {
    for (const w of list) {
      const ww = normalize(w)
      if (ww && t.includes(ww)) return key
    }
  }

  return null
}
