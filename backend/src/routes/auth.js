import express from 'express'
import { User } from '../models/User.js'

const router = express.Router()

function normalizePhone(raw) {
  const phone = String(raw || '').trim()
  // Keep only digits and + for simple normalization.
  return phone.replace(/[\s\-()]/g, '')
}

function normalizeRole(raw) {
  const role = String(raw || '').toLowerCase().trim()
  if (role === 'admin' || role === 'employer' || role === 'employee') return role
  return 'employee'
}

router.post('/signup', async (req, res) => {
  const phone = normalizePhone(req.body?.phone)
  const role = normalizeRole(req.body?.role)

  if (!phone) return res.status(400).json({ error: 'missing_phone' })

  const existing = await User.findOne({ phone })
  if (existing) {
    // Keep behavior simple for take-home: allow “signup” to update the role.
    existing.role = role
    await existing.save()
    return res.json({ user: existing })
  }

  const user = await User.create({ phone, role })
  return res.status(201).json({ user })
})

router.post('/login', async (req, res) => {
  const phone = normalizePhone(req.body?.phone)
  if (!phone) return res.status(400).json({ error: 'missing_phone' })

  const user = await User.findOne({ phone })
  if (!user) return res.status(404).json({ error: 'user_not_found' })

  return res.json({ user })
})

export default router
