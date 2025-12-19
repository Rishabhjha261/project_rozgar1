import express from 'express'
import { Job } from '../models/Job.js'

const router = express.Router()

function getRole(req) {
  return String(req.header('x-role') || '').toLowerCase()
}

function getClientId(req) {
  return String(req.header('x-client-id') || '').trim()
}

router.get('/', async (req, res) => {
  const category = req.query.category ? String(req.query.category).toLowerCase() : null
  const q = req.query.q ? String(req.query.q).toLowerCase() : null
  const ownerId = req.query.ownerId ? String(req.query.ownerId) : null
  const includeHidden = String(req.query.includeHidden || '') === 'true'

  const lat = req.query.lat != null ? Number(req.query.lat) : null
  const lng = req.query.lng != null ? Number(req.query.lng) : null
  const maxDistanceKm = req.query.maxDistanceKm != null ? Number(req.query.maxDistanceKm) : null

  const filter = {}
  if (!includeHidden) filter.hidden = false
  if (category) filter.category = category
  if (ownerId) filter.ownerId = ownerId
  if (q) {
    filter.$or = [{ title: { $regex: q, $options: 'i' } }, { area: { $regex: q, $options: 'i' } }]
  }

  let mongoQuery = Job.find(filter)

  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    const maxDistanceMeters = maxDistanceKm != null && Number.isFinite(maxDistanceKm) ? maxDistanceKm * 1000 : null
    mongoQuery = Job.find({
      ...filter,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          ...(maxDistanceMeters ? { $maxDistance: maxDistanceMeters } : {}),
        },
      },
    })
  } else {
    mongoQuery = mongoQuery.sort({ createdAt: -1 })
  }

  const jobs = await mongoQuery.limit(200).lean()

  res.json({ jobs })
})

router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id).lean()
  if (!job) return res.status(404).json({ error: 'not_found' })

  const role = getRole(req)
  if (job.hidden && role !== 'admin') return res.status(404).json({ error: 'not_found' })

  res.json({ job })
})

router.post('/', async (req, res) => {
  const role = getRole(req)
  const ownerId = getClientId(req)

  if (role !== 'employer') return res.status(403).json({ error: 'forbidden' })
  if (!ownerId) return res.status(400).json({ error: 'missing_client_id' })

  const b = req.body || {}

  const job = await Job.create({
    category: String(b.category || '').toLowerCase(),
    title: String(b.title || '').trim(),
    area: String(b.area || '').trim(),
    location: { type: 'Point', coordinates: [Number(b.lng), Number(b.lat)] },
    salaryMin: Number(b.salaryMin),
    salaryMax: Number(b.salaryMax),
    shift: String(b.shift || ''),
    verified: false,
    rating: null,
    postedByRole: 'employer',
    ownerId,
    hidden: false,
    contact: {
      phone: String(b.phone || '').trim(),
      whatsapp: String(b.whatsapp || b.phone || '').trim(),
    },
  })

  res.status(201).json({ job })
})

router.patch('/:id/hidden', async (req, res) => {
  const role = getRole(req)
  if (role !== 'admin') return res.status(403).json({ error: 'forbidden' })

  const hidden = Boolean(req.body?.hidden)
  const job = await Job.findByIdAndUpdate(req.params.id, { hidden }, { new: true }).lean()
  if (!job) return res.status(404).json({ error: 'not_found' })

  res.json({ job })
})

export default router
