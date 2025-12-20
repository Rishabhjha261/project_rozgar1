Rozgar – Blue-Collar Job Discovery Platform

🔗 Live Application
https://project-rozgar1-frontend1.onrender.com/

💻 GitHub Repository
https://github.com/Rishabhjha261/project_rozgar1

🌍 Overview

Rozgar is a mobile-first job discovery platform built for blue-collar and semi-skilled workers such as maids, drivers, security guards, delivery partners, electricians, and plumbers.

The platform is designed with user empathy at its core and works seamlessly on any device — mobile, tablet, or desktop.

❓ The PROMBLEM

Most existing job portals:

Are text-heavy and confusing

Require form filling and login

Are difficult for non-English users

Do not prioritize nearby jobs

However, blue-collar workers usually:

Need jobs near their location

Prefer visual recognition over reading

Want quick contact, not long forms

Worry about fake or unverified job posts

Already use phone calls and WhatsApp

Rozgar is built specifically to solve these problems.

⭐ Key Features
🌐 Language Translation

Users can switch languages to understand job details easily.

📍 Location-Wise Job Sorting

Nearby jobs are shown first, reducing travel time and effort.

🧠 Symbol-Based Job Recognition

Icons and symbols help illiterate or semi-literate users identify job types quickly.

📜 Minimal Scrolling UI

Important information is visible with very few scroll actions.

📞 Direct Call & WhatsApp Apply

Workers can call or WhatsApp employers with one tap, making job application effortless.

✅ Job Verification Status

Each job clearly shows Verified / Not Verified status.
Verification is done by the app owner to build trust.

🚨 Reported Job Handling

Jobs reported by users can be reviewed and removed by the app owner.

📱 Works on Any Device

Fully responsive and usable on mobile, tablet, and desktop.

🔐 Data & Authentication Approach
Mock Data Usage

The current version runs on mock/sample data.

This allowed focus on UX, frontend structure, and user flow within limited time.

Data structures are backend-ready and can be connected to real APIs easily.

Authentication

Authentication is not implemented in this version.

This was a deliberate product decision to:

Reduce friction for first-time users

Allow instant job browsing and application via call/WhatsApp

OTP-based authentication can be added later without changing the UI.

⚖️ Challenges Faced & Trade-offs
🌐 Language Translation

Challenge: Google Translate APIs are paid.

Decision: Built a dictionary-based translation system.

Trade-off: Limited dynamic translation but lightweight and cost-effective.

📍 Location-Wise Sorting

Challenge: Real-time GPS adds complexity and privacy concerns.

Decision: Implemented proximity-based sorting logic.

Trade-off: GPS can be added later without redesign.

🔐 Authentication

Challenge: Requires backend, OTP flows, and extra UI states.

Decision: Skipped authentication to keep experience frictionless.

Trade-off: Faster access for users; auth can be added later.

🔧 Backend Integration

Challenge: Limited challenge timeline.

Decision: Used mock data with backend-ready frontend architecture.

Trade-off: Complete product flow without full API setup.

🔊 Voice / Speaker Support

Challenge: Browser compatibility and testing effort.

Decision: Deferred and focused on visual accessibility instead.

Trade-off: Icons and minimal text already support low-literacy users.

🛡 Trust & Verification

Challenge: Users fear fake job postings.

Decision: Added verified badges and owner-controlled moderation.

Trade-off: Manual effort, but significantly higher trust.

🛠 Tech Stack

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

Creating a UI usable even for low-literacy users

Making clear trade-offs instead of half-building features

Delivering a working, deployed product within time constraints

Owning the full journey: product thinking → UI → frontend → deployment

This project reflects how I approach real-world problems with empathy, clarity, and responsibility.

👤 Author

Rishabh Jha
React Developer
📞 Contact: 6206798893
📧 Email: jharishav@261
