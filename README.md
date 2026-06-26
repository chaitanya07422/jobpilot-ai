# JobPilot AI
AI-powered job automation platform frontend. Discover backend engineering roles, get resume-based match scores, preview opportunities, and unlock auto-apply with a subscription — all with a modern dark SaaS UI inspired by Linear, Vercel, and Cursor.

> **Note:** This is a **frontend-only** project. All data is mocked locally. No backend connection is required to run or demo the app.

**Live repo:** https://github.com/chaitanya07422/jobpilot-ai

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Mock Data & API Layer](#mock-data--api-layer)
- [Subscription & Payment (Demo)](#subscription--payment-demo)
- [Design System](#design-system)
- [Scripts](#scripts)
- [Environment & Configuration](#environment--configuration)
- [Roadmap](#roadmap)

---

## Overview

JobPilot AI simulates an end-to-end job search automation pipeline:

1. **Upload a resume** → AI extracts skills (mock)
2. **Preview matched jobs** → Match scores visible, job details blurred
3. **Subscribe** → Unlock full job data, dashboard pipeline, and auto-apply
4. **Manage applications** → Kanban board, approvals, insights, activity log

The app is built for demo and frontend development. When you're ready to connect a real backend, replace the mock services in `src/api/` with actual HTTP calls.

---

## Features

### Authentication
- Login / Register with persisted session (`localStorage` via Zustand)
- Protected routes — unauthenticated users redirect to `/login`

### Resume & Matching
- Drag-and-drop PDF resume upload
- Skill extraction (mock) after upload
- **8 job suggestions** ranked by match score (65–98%)
- Blurred preview for unsubscribed users (scores visible, company/role/location locked)

### Dashboard (Subscribed)
- Animated stats: jobs scanned, pending approval, applied this week, interview rate
- Match queue with approve/reject actions
- Top match score ring with breakdown (skills, experience, embedding, Gemini re-rank)
- Discovery source health (Greenhouse, Lever, Ashby, LinkedIn, Naukri)
- Recent high-match jobs

### Jobs
- Search and filter by status, match score, source
- Responsive table (desktop) and cards (mobile)
- Job detail page with radar chart match analysis

### Applications
- Drag-and-drop Kanban: Pending → Applied → Interview → Offer → Rejected
- Powered by `@dnd-kit`

### Other
- **Approvals** — pending jobs awaiting user action
- **Resumes** — multiple resume variants (Backend, AI, Cloud)
- **Insights** — skill gaps, company rankings, weekly match trends (Recharts)
- **Activity** — pipeline event timeline
- **Settings** — job preferences, Telegram integration, source toggles, billing

### UX
- Loading, empty, and error states
- Skeleton loaders
- Fully responsive / mobile-friendly
- Strict TypeScript (no `any`)

---

## User Flow

```
Register / Login
      │
      ▼
Upload Resume ──────────────────────────────┐
      │                                      │
      ▼                                      │
Preview Job Matches (blurred)                │
  • Match scores visible                     │
  • Company, role, salary blurred            │
      │                                      │
      ▼                                      │
Subscribe (mock payment or Demo Subscribe)   │
      │                                      │
      ▼                                      │
Full Access                                  │
  • Unblurred job details                    │
  • Auto-apply toggle                        │
  • Dashboard pipeline                       │
  • Applications Kanban                      │
  • Insights & activity                      │
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build | Vite 8 |
| Styling | TailwindCSS 4 |
| Routing | React Router 7 |
| State | Zustand (persisted) |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Icons | Lucide React |
| Drag & drop | @dnd-kit |
| UI patterns | shadcn/ui-style components |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
git clone https://github.com/chaitanya07422/jobpilot-ai.git
cd jobpilot-ai
npm install
npm run dev
```

Open **http://localhost:5173**

### Quick demo path

1. **Register** a new account (any email/password)
2. Go to **Resumes** → upload any PDF
3. View **blurred job matches** on Dashboard or Jobs
4. Go to **Billing** → click **Demo Subscribe** (or use mock card `4111 1111 1111 1111`)
5. Explore the full dashboard, jobs, applications, and insights

### Reset local state

```js
// In browser DevTools console
localStorage.clear()
location.reload()
```

---

## Project Structure

```
src/
├── pages/              # Route-level views
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Jobs.tsx
│   ├── JobDetail.tsx
│   ├── Applications.tsx
│   ├── Approvals.tsx
│   ├── Resumes.tsx
│   ├── Insights.tsx
│   ├── Activity.tsx
│   ├── Settings.tsx
│   └── Pricing.tsx
│
├── components/
│   ├── layout/         # Sidebar, TopBar, PageShell
│   ├── dashboard/      # StatsBar, MatchQueue, DiscoveryStatus, etc.
│   ├── jobs/           # JobTable, JobFilters, ResumeJobSuggestions
│   ├── applications/   # Kanban pipeline
│   ├── resumes/        # Upload & resume cards
│   ├── insights/       # Charts & skill gap cards
│   ├── activity/       # Timeline
│   ├── payment/        # Pricing cards & mock checkout
│   ├── onboarding/     # Welcome empty state
│   └── ui/             # Button, Card, Modal, Badge, Loader, etc.
│
├── mock/               # Static mock data
│   ├── jobs.ts         # Razorpay, Zerodha, PhonePe, etc.
│   ├── applications.ts
│   ├── resumes.ts
│   ├── activities.ts
│   ├── insights.ts
│   ├── plans.ts
│   └── empty.ts
│
├── api/                # Mock services (simulated latency)
│   ├── client.ts
│   ├── jobs.api.ts
│   ├── suggestions.api.ts
│   ├── applications.api.ts
│   ├── resumes.api.ts
│   ├── payment.api.ts
│   └── insights.api.ts
│
├── store/
│   ├── authStore.ts    # User, subscription, auth
│   └── uiStore.ts      # Sidebar, automation, preferences
│
├── types/              # Strict TypeScript interfaces
├── lib/                # Utils, pipeline gating, activation helpers
└── index.css           # Tailwind theme tokens
```

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Main ops view (empty → suggestions → full pipeline) |
| `/jobs` | Job listings / blurred suggestions |
| `/jobs/:id` | Job detail + match radar chart |
| `/applications` | Kanban application pipeline |
| `/approvals` | Jobs pending approval |
| `/resumes` | Resume management & upload |
| `/insights` | AI skill gap & trend analytics |
| `/activity` | Automation event log |
| `/settings` | Preferences & integrations |
| `/pricing` | Plans, mock payment, demo subscribe |

---

## Mock Data & API Layer

All API modules in `src/api/` use `mockFetch()` from `client.ts` to simulate ~400–800ms network delay.

### Sample companies (backend roles)

Razorpay, Sarvam AI, PhonePe, Zerodha, Meesho, Swiggy, Groww

### Pipeline gating (`src/lib/pipeline.ts`)

| Check | Condition |
|-------|-----------|
| `hasResumeUploaded()` | User uploaded at least one resume |
| `isSubscribed()` | Active subscription in auth store |
| `canViewSuggestions()` | Resume uploaded → show blurred matches |
| `canAutoApply()` | Subscribed → enable automation |

### Resume persistence

Uploaded resumes are stored in `localStorage` per user (`jobpilot-resumes:{userId}`).

---

## Subscription & Payment (Demo)

Three plans (INR/month):

| Plan | Price | Highlights |
|------|-------|------------|
| Starter | ₹999 | 50 scans/day, 1 resume |
| Pro | ₹2,499 | Unlimited scans, auto-apply, Telegram |
| Enterprise | ₹4,999 | Priority scanning, API access |

### Mock checkout

Use test card on the payment modal:

```
Card: 4111 1111 1111 1111
Expiry: 12/28
CVV: 123
```

### Demo Subscribe

On the **Billing** page, click **Demo Subscribe** to instantly activate Pro without payment. Remove this before production.

Activation logic lives in `src/lib/activatePipeline.ts`.

---

## Design System

Dark theme tokens (defined in `src/index.css`):

| Token | Value |
|-------|-------|
| Background | `#0B0E14` |
| Panel | `#141925` |
| Secondary Panel | `#1B2230` |
| Border | `#2A3344` |
| Text | `#E8EAED` |
| Muted | `#8A93A6` |
| Amber | `#FF9F1C` |
| Cyan | `#4ECDC4` |
| Green | `#5FD068` |
| Red | `#FF6B6B` |

**Typography:** Space Grotesk (headings), Inter (body), JetBrains Mono (numbers)

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Type-check + production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

---

## Environment & Configuration

No `.env` file is required. The app runs entirely with mock data.

Path alias `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

---

## Roadmap

- [ ] Connect to real backend API
- [ ] Replace mock payment with Razorpay / Stripe
- [ ] Real resume parsing & embedding pipeline
- [ ] Telegram bot integration
- [ ] Remove Demo Subscribe button in production
- [ ] E2E tests (Playwright / Cypress)
- [ ] Deploy to Vercel / Netlify

---

## License

Private project. All rights reserved.
