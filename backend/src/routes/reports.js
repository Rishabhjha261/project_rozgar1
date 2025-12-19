import express from 'express'
import { Report } from '../models/Report.js'
import { Job } from '../models/Job.js'

const router = express.Router()

function getRole(req) {
  return String(req.header('x-role') || '').toLowerCase()
}

function getClientId(req) {
  return String(req.header('x-client-id') || '').trim()
}

router.get('/', async (req, res) => {
  const role = getRole(req)
  if (role !== 'admin') return res.status(403).json({ error: 'forbidden' })

  const status = req.query.status ? String(req.query.status) : null
  const filter = status ? { status } : {}

  const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(200).lean()
  res.json({ reports })
})

router.post('/', async (req, res) => {
  const reporterId = getClientId(req)
  if (!reporterId) return res.status(400).json({ error: 'missing_client_id' })

  const b = req.body || {}
  const jobId = String(b.jobId || '')
  const reason = String(b.reason || '')
  const notes = String(b.notes || '')

  const job = await Job.findById(jobId).lean()
  if (!job) return res.status(404).json({ error: 'job_not_found' })

  const report = await Report.create({
    jobId,
    reason,
    notes,
    status: 'open',
    reporterId,
  })

  res.status(201).json({ report })
})

router.patch('/:id/resolve', async (req, res) => {
  const role = getRole(req)
  if (role !== 'admin') return res.status(403).json({ error: 'forbidden' })

  const report = await Report.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true }).lean()
  if (!report) return res.status(404).json({ error: 'not_found' })

  res.json({ report })
})

export default router
