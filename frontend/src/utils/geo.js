export function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        })
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000, ...options },
    )
  })
}

// Haversine formula
export function distanceKm(a, b) {
  if (!a || !b) return null
  const R = 6371
  const dLat = degToRad(b.lat - a.lat)
  const dLng = degToRad(b.lng - a.lng)
  const lat1 = degToRad(a.lat)
  const lat2 = degToRad(b.lat)

  const s1 = Math.sin(dLat / 2)
  const s2 = Math.sin(dLng / 2)
  const h = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function degToRad(v) {
  return (v * Math.PI) / 180
}

export function formatKm(km) {
  if (km == null) return ''
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}
