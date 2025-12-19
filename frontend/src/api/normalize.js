export function normalizeJob(doc) {
  if (!doc) return null

  const id = doc._id || doc.id
  const coords = doc.location?.coordinates

  return {
    id: String(id),
    category: String(doc.category || '').toLowerCase(),
    title: doc.title || '',
    area: doc.area || '',
    geo: coords && coords.length === 2 ? { lng: Number(coords[0]), lat: Number(coords[1]) } : null,
    salaryMin: Number(doc.salaryMin || 0),
    salaryMax: Number(doc.salaryMax || 0),
    shift: doc.shift || '',
    verified: Boolean(doc.verified),
    rating: doc.rating == null ? null : Number(doc.rating),
    createdAt: doc.createdAt ? new Date(doc.createdAt).getTime() : Date.now(),
    contact: {
      phone: doc.contact?.phone || '',
      whatsapp: doc.contact?.whatsapp || doc.contact?.phone || '',
    },
    ownerId: doc.ownerId || null,
    hidden: Boolean(doc.hidden),
  }
}
