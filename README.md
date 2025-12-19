# Rozgar — Blue-collar jobs nearby

A mobile-first “Naukri for blue-collar workers” prototype focused on fast discovery, low-friction flows, regional-language friendliness, and trust signals.

## Live features (high level)
- Job browsing by category + search (plus optional location-based sorting).
- Three roles: `employee`, `employer`, `admin`.
- Employer can post jobs.
- Admin can view reports and hide/unhide job listings.
- Voice search (browser-dependent; see notes below).

## Tech stack
Frontend (`frontend/`)
- React + Vite
- Tailwind CSS
- Zustand for state

Backend (`backend/`)
- Node.js + Express
- MongoDB + Mongoose

## Local setup

### Quick commands from repo root (optional)
- Install deps:
  - `npm run install:frontend`
  - `npm run install:backend`
- Run:
  - `npm run dev:backend`
  - `npm run dev:frontend`

### 1) Backend
From `backend/`:
1. Install deps:
   - `npm install`
2. Create env file:
   - Copy `backend/.env.example` → `backend/.env`
   - Set `MONGODB_URI` in `backend/.env`
3. Run dev server:
   - `npm run dev`

Backend defaults:
- `PORT=4000`
- `CORS_ORIGIN=http://localhost:5173`

### 2) Frontend
From `frontend/`:
1. Install deps:
   - `npm install`
2. Run dev server:
   - `npm run dev`

Frontend talks to backend via:
- `VITE_API_BASE_URL` (optional). If not set, it defaults to `http://localhost:4000`.

## Usage notes

### Demo auth (Login/Signup)
This project uses a minimal phone-based demo auth (no OTP/password) to keep flows end-to-end:
- `POST /api/auth/signup` creates (or updates) a user by phone and role.
- `POST /api/auth/login` logs in by phone.

The frontend sends these headers on API calls:
- `x-role` — current selected role
- `x-client-id` — the logged-in user id (used by backend as `ownerId`/`reporterId`)

### Voice search
Voice search uses the Web Speech API. It only works in browsers that support `SpeechRecognition` (commonly Chrome/Edge). If unsupported, the voice button won’t render.

## Approach / product decisions (short)
- Mobile-first layout and large tap targets to reduce friction.
- Category-first navigation with icons to minimize reading effort.
- Location-assisted sorting to quickly surface nearby jobs.
- Trust signals:
  - Verified/unverified badges on listings
  - Reporting flow + admin moderation (hide/unhide)
- Internationalization support uses a dictionary-based `t(key)` with a mock translation abstraction that can later be swapped to a backend proxy.

## What’s next (if you extend it)
- Production-grade auth (OTP / JWT).
- Real translation service via backend proxy.
- Automated tests (none are currently configured).
