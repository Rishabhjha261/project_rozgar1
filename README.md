# Rozgar – Blue-Collar Job Discovery Platform

🔗 **Live Application**  
https://project-rozgar1-frontend1.onrender.com/

💻 **GitHub Repository**  
https://github.com/Rishabhjha261/project_rozgar1

---

## Overview

**Rozgar** is a mobile-first job discovery platform designed specifically for **blue-collar and semi-skilled workers** such as maids, drivers, security guards, delivery partners, electricians, and plumbers.

The application focuses on **simplicity, accessibility, and real-world usability** and works smoothly on **any device** — mobile, tablet, or desktop.

---

## Problem Statement

Most existing job portals:
- Are text heavy
- Require form filling and login
- Are difficult for non-English users
- Do not prioritize nearby jobs

Blue-collar workers usually:
- Need jobs **near their location**
- Prefer **visual recognition** over reading
- Want **quick contact**, not long forms
- Worry about **fake or unverified job posts**
- Already use **phone calls and WhatsApp**

Rozgar is designed to solve these problems.

---

## Key Features

- **Language Translation Support**  
  Users can switch languages to understand job details easily.

- **Location-Wise Job Sorting**  
  Nearby jobs are shown first, reducing travel effort.

- **Symbol-Based Job Recognition**  
  Icons and symbols help illiterate or semi-literate users identify job types quickly.

- **Minimal Scrolling UI**  
  Important information is visible with very few scroll actions.

- **Direct Call & WhatsApp Apply**  
  Employees can contact employers directly via call or WhatsApp to apply for jobs easily.

- **🎤 Voice Search Support**  
  Users can search for jobs using voice input, helping users who find typing difficult or are not comfortable with text input.

- **Role-Based Access & Responsibilities**
  - **Admin**
    - View reported jobs
    - Hide or remove inappropriate job listings
    - Verify job postings to maintain platform trust
  - **Employer**
    - View all job listings
    - Post new job opportunities
  - **Employee**
    - Browse available jobs
    - Identify jobs using symbols and verification badges
    - Apply via call or WhatsApp

- **Job Verification Status**  
  Jobs are clearly marked as **Verified** or **Not Verified**, verified by the app owner.

- **Reported Job Moderation**  
  Employees can report jobs, and admins can review and remove them.

- **Works on Any Device**  
  Fully responsive on mobile, tablet, and desktop devices.

---

## Data & Authentication

### Mock Data
- The current version works on **mock/sample data**.
- Focused on UX, frontend architecture, and product flow.
- Backend-ready data structure.

### Authentication
- Simple signup page included.
- Authentication is **not implemented**.
- Manual role selection allows testing different user views.
- Chosen to reduce friction and allow instant browsing.

---

## Challenges Faced & Trade-offs

### Language Translation
- Google Translate APIs are paid.
- Used a **dictionary-based translation system**.
- Trade-off: Not fully dynamic but lightweight.

### Location-Wise Job Sorting
- Real-time GPS increases complexity.
- Implemented proximity-based sorting logic.
- Trade-off: GPS can be added later.

### Backend Integration
- Full backend integration limited by time.
- Used mock data with backend-ready structure.
- Trade-off: APIs can be added later.

### Authentication
- OTP authentication requires backend setup.
- Skipped to keep experience frictionless.

### Voice Search
- Browser compatibility and permission handling required extra effort.
- Implemented voice search with text fallback.
- Trade-off: Voice support depends on browser availability.

### Trust & Verification
- Addressed fake job concerns.
- Added verification badges and admin moderation.
- Trade-off: Manual verification effort.

---

## Tech Stack

- React.js
- Vite
- JavaScript (ES6+)
- CSS
- Node.js
- MongoDB

---

## What I’m Proud Of

- Designing for **real blue-collar users**
- Making job application as easy as a **phone call or WhatsApp**
- Improving accessibility with **voice search**
- Building trust with verification and reporting
- Supporting low-literacy users with visual design
- Making clear product trade-offs
- Delivering a **live, working product**
- End-to-end ownership: idea → UI → frontend → deployment

---

> This project reflects my ability to balance **user empathy, technical decisions, and delivery constraints** while shipping usable software.


👤 Author

Rishabh Jha
React Developer
📞 Contact: 6206798893
📧 Email: jharishav261@gmail.com
