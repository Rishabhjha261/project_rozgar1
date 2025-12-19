export const CATEGORIES = [
  { key: 'maid', labelKey: 'category.maid', icon: '🧹' },
  { key: 'driver', labelKey: 'category.driver', icon: '🚗' },
  { key: 'delivery', labelKey: 'category.delivery', icon: '🛵' },
  { key: 'security_guard', labelKey: 'category.security_guard', icon: '🛡️' },
  { key: 'electrician', labelKey: 'category.electrician', icon: '💡' },
  { key: 'plumber', labelKey: 'category.plumber', icon: '🔧' },
  { key: 'labour', labelKey: 'category.labour', icon: '👷' },
  { key: 'waiter', labelKey: 'category.waiter', icon: '🍽️' },
]

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || null
}
