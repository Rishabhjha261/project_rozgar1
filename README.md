Rozgar – Blue-Collar Job Discovery Platform

🔗 Live Application
https://project-rozgar1-frontend1.onrender.com/

💻 GitHub Repository
https://github.com/Rishabhjha261/project_rozgar1

Overview

Rozgar is a mobile-first job discovery platform designed for blue-collar and semi-skilled workers such as maids, drivers, security guards, delivery partners, electricians, and plumbers.

The application focuses on simplicity, accessibility, and real-world usability, and works smoothly on any device — mobile, tablet, or desktop.

The Problem

Most job portals:

Are text heavy

Require form filling and login

Are difficult for non-English users

Do not prioritize nearby jobs

Blue-collar workers usually:

Need jobs near their location

Prefer visual recognition over reading

Want quick contact, not long forms

Worry about fake or unverified job posts

Already use phone calls and WhatsApp

Rozgar is designed specifically to solve these problems.

Key Features

Language Translation Support
Users can switch languages to understand job details easily.

Location-Wise Job Sorting
Nearby jobs are shown first, reducing travel effort.

Symbol-Based Job Recognition
Icons and symbols help illiterate or semi-literate users identify job types quickly.

Minimal Scrolling UI
Important information is visible with very few scroll actions.

Direct Call & WhatsApp Apply
Workers can call or WhatsApp employers directly with one tap.

Job Verification Status
Each job clearly shows whether it is Verified or Not Verified.
Verification is done by the app owner, helping users trust genuine listings.

Reported Job Handling
Jobs reported by users can be reviewed and removed by the app owner.

Works on Any Device
Fully responsive and usable on mobile, tablet, and desktop.

Data & Authentication Approach
Mock Data Usage

The current version of the app works with mock/sample data.

This was done to focus on UX, frontend structure, and user flow within limited time.

The data structure is backend-ready and can be connected to real APIs easily.

Authentication

Authentication is not implemented in this version.

This was a conscious decision to:

Reduce friction for first-time users

Allow instant job browsing and application via call/WhatsApp

Authentication (OTP-based) can be added later without changing the UI.

Challenges Faced & Trade-offs
1. Language Translation

Challenge:
Most users are not comfortable with English, but Google Translate APIs are paid.

Decision:
Implemented a dictionary-based translation system for key job and UI content.

Trade-off:
Not fully dynamic, but lightweight, cost-effective, and scalable.

2. Location-Wise Job Sorting

Challenge:
Real-time GPS and maps increase complexity and privacy concerns.

Decision:
Implemented proximity-based sorting logic using available location data.

Trade-off:
UI and logic are ready; GPS can be added later without redesign.

3. Authentication

Challenge:
Authentication requires backend, OTP flows, and extra UI states.

Decision:
Skipped authentication to keep the experience fast and frictionless.

Trade-off:
Users can instantly browse and apply; auth can be added later if required.

4. Backend Integration

Challenge:
Full backend integration within limited challenge time.

Decision:
Used mock data with a clean, backend-ready frontend architecture.

Trade-off:
Demonstrates complete product flow while keeping future integration easy.

5. Voice / Speaker Support

Challenge:
Browser compatibility and testing complexity.

Decision:
Deferred voice support and focused on visual accessibility instead.

Trade-off:
Icons, symbols, and minimal text already support low-literacy users.

6. Trust & Job Verification

Challenge:
Users worry about fake or unsafe job postings.

Decision:
Added Verified / Not Verified job status and owner-controlled moderation.

Trade-off:
Manual verification effort, but much higher user trust.

Tech Stack

React.js

Vite

JavaScript (ES6+)

CSS

Node.js

MongoDB

🌟 What I’m Proud Of

Designing for real blue-collar users, not assumptions

Making job application as easy as a phone call or WhatsApp message

Building trust using verification and reporting features

Creating an interface usable even for low-literacy users

Making clear trade-offs instead of half-building features

Delivering a working, deployed product within time constraints

Owning the full journey: product thinking → UI → frontend → deployment

This project reflects how I approach real-world problems with empathy and responsibility.

Author

Rishabh Jha
React Developer
Contact: 6206798893
Email: jharishav@261
