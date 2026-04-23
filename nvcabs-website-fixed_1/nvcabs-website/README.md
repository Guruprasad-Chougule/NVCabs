# 🚗 NV Cabs — Full-Stack Cab Booking Platform

> Production-ready, SEO-optimized cab booking website built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start (Local)](#quick-start-local)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Push to GitHub](#push-to-github)
8. [Deploy on Vercel](#deploy-on-vercel)
9. [Admin Dashboard](#admin-dashboard)
10. [API Reference](#api-reference)
11. [Features](#features)

---

## 🏢 Project Overview

NV Cabs is a premier cab booking platform for South India. This codebase provides:

- **Customer Website** — Book cabs, view routes, browse tour packages
- **Real-Time Fare Estimation** — Based on distance, vehicle type, time
- **OTP Phone Verification** — Secure booking with SMS verification
- **Admin Dashboard** — Full booking management, driver assignment
- **SEO Optimized** — SSR pages, sitemap, structured data

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Zustand |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + OTP (Twilio/MSG91) |
| Email | SendGrid |
| Payment | Razorpay (integration ready) |
| Hosting | Vercel |

---

## 📁 Project Structure

```
nvcabs-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── book-a-cab/         # Booking page with OTP + fare estimator
│   │   ├── route/[slug]/       # Dynamic route detail pages
│   │   ├── tour-packages/      # Tour packages listing + detail
│   │   ├── routes/             # All routes listing
│   │   ├── services/           # Services page
│   │   ├── about-us/           # About us page
│   │   ├── contact/            # Contact + enquiry form
│   │   ├── admin/              # Admin dashboard (protected)
│   │   │   ├── login/          # Admin login
│   │   │   ├── dashboard/      # Stats + recent bookings
│   │   │   ├── bookings/       # Booking management + status
│   │   │   ├── vehicles/       # Fleet management CRUD
│   │   │   ├── enquiries/      # Contact form submissions
│   │   │   └── routes/         # Route management view
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # OTP send + verify
│   │   │   ├── bookings/       # Create + get bookings
│   │   │   ├── fare-estimate/  # Fare calculation engine
│   │   │   ├── routes/         # Route listings + detail
│   │   │   ├── tour-packages/  # Package listings + detail
│   │   │   ├── vehicles/       # Vehicle types
│   │   │   ├── enquiries/      # Contact submissions
│   │   │   ├── reviews/        # Customer reviews
│   │   │   └── admin/          # Admin-only CRUD endpoints
│   │   ├── sitemap.ts          # Auto-generated sitemap
│   │   ├── robots.ts           # SEO robots config
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── layout/             # Header, Footer, FloatingButtons
│   │   └── home/               # Hero, Services, Fleet, etc.
│   ├── lib/
│   │   ├── prisma.ts           # DB client singleton
│   │   ├── auth.ts             # JWT + rate limiting
│   │   ├── utils.ts            # Helpers, formatters
│   │   └── store.ts            # Zustand state
│   ├── services/
│   │   ├── fareService.ts      # Fare calculation logic
│   │   └── notificationService.ts  # SMS + Email
│   ├── types/
│   │   └── index.ts            # All TypeScript interfaces
│   └── styles/
│       └── globals.css         # Tailwind + custom styles
├── prisma/
│   ├── schema.prisma           # Full DB schema
│   └── seed.ts                 # Sample data seeder
├── .env.example                # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally
- npm or yarn

### Step 1 — Clone & Install

```bash
# If from ZIP, navigate to folder
cd nvcabs-website

# Install all dependencies
npm install
```

### Step 2 — Set Up Environment

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local   # or use any editor
```

**Minimum required values for local dev:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/nvcabs_db"
NEXTAUTH_SECRET="any-random-32-char-string-here"
MOCK_OTP_ENABLED="true"
MOCK_OTP_VALUE="123456"
```

### Step 3 — Set Up Database

```bash
# Create the database (if not exists)
createdb nvcabs_db

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 4 — Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char secret |
| `MOCK_OTP_ENABLED` | Dev only | Set to "true" for local dev |
| `MOCK_OTP_VALUE` | Dev only | Fixed OTP for testing (e.g. "123456") |
| `TWILIO_ACCOUNT_SID` | Prod | SMS OTP delivery |
| `TWILIO_AUTH_TOKEN` | Prod | SMS OTP delivery |
| `SENDGRID_API_KEY` | Prod | Email confirmations |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Prod | Maps autocomplete |
| `RAZORPAY_KEY_ID` | Prod | Payment processing |
| `RAZORPAY_KEY_SECRET` | Prod | Payment processing |
| `ADMIN_JWT_SECRET` | ✅ | Admin panel auth secret |

---

## 🗄️ Database Setup

### Schema
The Prisma schema defines 10 tables:
- `users` — customers, admins, drivers
- `bookings` — trip bookings with full details
- `vehicles` — fleet management
- `drivers` — driver profiles linked to users
- `routes` — SEO-optimized route pages
- `tour_packages` — multi-day tour packages
- `payments` — payment transaction records
- `reviews` — customer reviews (moderated)
- `pricing_rules` — per-vehicle/trip-type pricing
- `enquiries` — contact form submissions
- `otp_verifications` — OTP verification records

### Commands
```bash
npm run db:generate    # Regenerate Prisma client
npm run db:push        # Sync schema (dev, no migrations)
npm run db:migrate     # Create migration (production)
npm run db:seed        # Seed with sample data
npm run db:studio      # Open Prisma Studio GUI
```

---

## 📤 Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial NV Cabs full-stack platform"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nvcabs-website.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deploy on Vercel

### Step 1 — Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### Step 2 — Set Up Production Database

1. Create a PostgreSQL database on [Neon](https://neon.tech) (free tier) or [Supabase](https://supabase.com) or Railway
2. Copy the connection string

### Step 3 — Deploy

```bash
vercel
```

Follow prompts:
- Framework: Next.js (auto-detected)
- Root directory: `.` (current)
- Build command: `npm run build`
- Output: `.next`

### Step 4 — Add Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-production-secret
ADMIN_JWT_SECRET=your-admin-secret
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
MOCK_OTP_ENABLED=false
NEXT_PUBLIC_APP_URL=https://www.nvcabs.in
```

### Step 5 — Run Migrations on Production

```bash
# Set DATABASE_URL to production DB
npx prisma migrate deploy
npx prisma db seed
```

### Step 6 — Set Custom Domain

In Vercel Dashboard → Domains → Add `www.nvcabs.in`

Update DNS at your registrar:
```
CNAME www → cname.vercel-dns.com
```

---

## 🔑 Admin Dashboard

Access at: `http://localhost:3000/admin/login`

**Default credentials (from seed):**
- Phone: `9530800800`
- Password: `Admin@NVCabs2024`

**Features:**
- 📊 Dashboard with live stats
- 📋 Booking management (filter, search, update status)
- 🚗 Vehicle fleet CRUD
- 📬 Enquiry management with email/call links
- 🗺️ Route management view

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/send-otp` | Send OTP to mobile |
| `POST` | `/api/auth/verify-otp` | Verify OTP, get JWT |
| `POST` | `/api/bookings` | Create booking |
| `GET` | `/api/bookings?ref=NV-...` | Get booking by ref |
| `POST` | `/api/fare-estimate` | Calculate fare |
| `GET` | `/api/routes` | List all routes |
| `GET` | `/api/routes/[slug]` | Route detail |
| `GET` | `/api/tour-packages` | List packages |
| `GET` | `/api/tour-packages/[slug]` | Package detail |
| `GET` | `/api/vehicles/types` | Vehicle types + pricing |
| `POST` | `/api/enquiries` | Submit contact form |
| `GET` | `/api/reviews` | Approved reviews |

### Admin Endpoints (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/auth/login` | Admin login |
| `GET` | `/api/admin/dashboard` | Dashboard stats |
| `GET/PUT` | `/api/admin/bookings` | List/update bookings |
| `GET/POST/PUT/DELETE` | `/api/admin/vehicles` | CRUD vehicles |
| `GET/PUT` | `/api/admin/enquiries` | List/update enquiries |

---

## ✨ Features

### Customer-Facing
- ✅ Responsive home page with booking widget
- ✅ OTP-verified mobile booking form
- ✅ Real-time fare estimator with breakdown
- ✅ All-vehicle fare comparison
- ✅ Dynamic route pages (SEO optimized)
- ✅ Tour packages with inclusions/exclusions
- ✅ WhatsApp floating button
- ✅ Click-to-call button
- ✅ Testimonials carousel
- ✅ Fleet showcase
- ✅ Contact form
- ✅ Policy pages (cancellation, privacy, terms)
- ✅ FAQ page

### Admin
- ✅ Secure admin login (JWT)
- ✅ Dashboard with stats and recent bookings
- ✅ Booking management with status updates
- ✅ Vehicle CRUD with activate/deactivate
- ✅ Enquiry management with email/call actions

### Technical
- ✅ Server-Side Rendering (SSR)
- ✅ Auto sitemap.xml generation
- ✅ robots.txt
- ✅ Open Graph + Twitter Card meta tags
- ✅ Rate limiting on public APIs
- ✅ Input validation with Zod
- ✅ Structured seed data
- ✅ Prisma ORM with full schema
- ✅ Mock SMS/email for development

---

## 📞 Support

**NV Cabs**  
Phone: 9530800800  
Email: support@nvcabs.in  
Address: Ground Floor, Building No. 62, Gunjur Post, Halasahalli Thippasandra, Bengaluru 560087

---

*Built for NV Cabs | v1.0 | April 2026*
