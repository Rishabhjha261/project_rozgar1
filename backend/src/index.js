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

const PORT = process.env.PORT || 4000
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
)

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/reports', reportsRouter)

async function main() {
  await connectToMongo(process.env.MONGODB_URI)

  if (String(process.env.SEED || '').toLowerCase() === 'true') {
    try {
      await seedIfEmpty({ ownerId: 'seed' })
    } catch {
      // ignore seed failures in dev
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
