import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectToMongo } from './db.js'
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import reportsRouter from './routes/reports.js'
import { seedIfEmpty } from './seed.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '1mb' }))

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: corsOrigin }))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/reports', reportsRouter)

const port = Number(process.env.PORT || 4000)

async function main() {
  await connectToMongo(process.env.MONGODB_URI)

  if (String(process.env.SEED || '').toLowerCase() === 'true') {
    try {
      await seedIfEmpty({ ownerId: 'seed' })
    } catch {
      // ignore seed failures in dev
    }
  }

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
