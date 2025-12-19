import { Job } from './models/Job.js'

const SEED_JOBS = [
  {
    category: 'maid',
    title: 'Home Maid (Cooking + Cleaning)',
    area: 'Andheri West, Mumbai',
    location: { type: 'Point', coordinates: [72.826, 19.135] },
    salaryMin: 12000,
    salaryMax: 16000,
    shift: 'Morning',
    verified: true,
    rating: 4.5,
  },
  {
    category: 'driver',
    title: 'Personal Driver (Car)',
    area: 'Indiranagar, Bengaluru',
    location: { type: 'Point', coordinates: [77.6412, 12.9716] },
    salaryMin: 18000,
    salaryMax: 25000,
    shift: 'Full Day',
    verified: false,
    rating: 4.1,
  },
  {
    category: 'delivery',
    title: 'Delivery Partner (2-Wheeler)',
    area: 'Gachibowli, Hyderabad',
    location: { type: 'Point', coordinates: [78.3489, 17.4401] },
    salaryMin: 15000,
    salaryMax: 30000,
    shift: 'Flexible',
    verified: true,
    rating: 4.3,
  },
  {
    category: 'security_guard',
    title: 'Security Guard (Night Shift)',
    area: 'Salt Lake, Kolkata',
    location: { type: 'Point', coordinates: [88.4171, 22.5867] },
    salaryMin: 14000,
    salaryMax: 18000,
    shift: 'Night',
    verified: true,
    rating: 4.0,
  },
  {
    category: 'electrician',
    title: 'Electrician (Home Visits)',
    area: 'Kothrud, Pune',
    location: { type: 'Point', coordinates: [73.8077, 18.5074] },
    salaryMin: 16000,
    salaryMax: 26000,
    shift: 'Day',
    verified: false,
    rating: 4.2,
  },
  {
    category: 'plumber',
    title: 'Plumber (Society Maintenance)',
    area: 'Viman Nagar, Pune',
    location: { type: 'Point', coordinates: [73.9143, 18.5679] },
    salaryMin: 17000,
    salaryMax: 24000,
    shift: 'Day',
    verified: true,
    rating: 4.4,
  },
  {
    category: 'labour',
    title: 'Construction Labour (Daily Wage)',
    area: 'Dwarka, Delhi',
    location: { type: 'Point', coordinates: [77.046, 28.5921] },
    salaryMin: 600,
    salaryMax: 1000,
    shift: 'Day',
    verified: true,
    rating: 4.0,
  },
  {
    category: 'waiter',
    title: 'Restaurant Waiter',
    area: 'Banjara Hills, Hyderabad',
    location: { type: 'Point', coordinates: [78.4485, 17.4123] },
    salaryMin: 12000,
    salaryMax: 18000,
    shift: 'Evening',
    verified: false,
    rating: 4.1,
  },
]

export async function seedIfEmpty({ ownerId = 'seed' } = {}) {
  const count = await Job.countDocuments({})
  if (count > 0) return { seeded: false, count }

  const docs = SEED_JOBS.map((j) => ({
    ...j,
    ownerId,
    postedByRole: 'employer',
    hidden: false,
  }))

  await Job.insertMany(docs)
  return { seeded: true, count: docs.length }
}
