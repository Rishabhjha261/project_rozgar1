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

- **Role-Based Access & Responsibilities**

  - **Admin**
    - Can view reports made by employees
    - Can hide or remove reported or inappropriate job listings
    - Verifies job postings to ensure platform trust

  - **Employer**
    - Can also act as an employee
    - Can view all available job listings
    - Has the option to post new job opportunities

  - **Employee**
    - Can view all available jobs
    - Can identify jobs using symbols and verification badges
    - Can apply directly by calling or messaging the employer via WhatsApp

- **Job Verification Status**  
  Each job clearly shows whether it is **Verified or Not Verified**, verified by the app owner.

- **Reported Job Moderation**  
  Employees can report jobs, and the admin can review and hide or remove them.

- **Works on Any Device**  
  Fully responsive and usable on mobile, tablet, and desktop devices.

---

## Data & Authentication

### Mock Data
- The current version works on **mock/sample data**.
- This allowed focus on **UX, frontend architecture, and product flow** within limited time.
- The data structure is **backend-ready** and can be connected to real APIs easily.

### Authentication
- Simple signup page.
- Authentication is **not implemented**. So there is the option of manual selection of roles to see how each role would see the application.
- This was a conscious decision to:
  - Reduce friction for first-time users
  - Allow instant browsing and better testing.

---

## Challenges Faced & Trade-offs

### Language Translation
- Google Translate APIs are paid.
- Implemented a **dictionary-based translation system** for core content.
- Trade-off: Not fully dynamic, but lightweight and scalable.

### Location-Wise Job Sorting
- Real-time GPS increases complexity and privacy concerns.
- Implemented **proximity-based sorting logic**.
- Trade-off: GPS can be added later without UI redesign.

### Backend Integration
- Full backend integration was limited by time.
- Built a **backend-ready frontend** using mock data.
- Trade-off: UX and flow are complete; APIs can be added later.

### Authentication
- OTP authentication requires backend and extra UI states.
- Skipped to keep job discovery **fast and frictionless**.

### Voice / Speaker Support
- Browser compatibility and testing required more time.
- Deferred and focused on **visual accessibility** instead.

### Trust & Verification
- Users worry about fake job posts.
- Added **Verified / Not Verified** status and owner moderation.
- Trade-off: Manual verification effort but higher user trust.

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

- Designing for **real blue-collar users**, not assumptions
- Making job application as easy as a **phone call or WhatsApp**
- Building trust using **job verification and reporting**
- Creating an interface usable even for **low-literacy users**
- Making clear trade-offs instead of half-building features
- Delivering a **live, working product** within time constraints
- Owning the full journey: product thinking → UI → frontend → deployment

---


---

> This project reflects my ability to balance **user empathy, technical decisions, and delivery constraints** while shipping usable software.

👤 Author

Rishabh Jha
React Developer
📞 Contact: 6206798893
📧 Email: jharishav@261
