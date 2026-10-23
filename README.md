# LegitAssist — Client

> **Find & Hire Expert Legal Counsel** — A modern, feature-rich online lawyer hiring platform built with Next.js 16, React 19, and HeroUI.

**Live URL:** https://legit-assist.vercel.app

---

## 📌 Purpose

LegitAssist connects legal seekers (clients) with skilled lawyers. Clients browse and hire legal experts, lawyers manage their listings after a one-time publishing fee, and admins oversee users, transactions, and platform analytics.

This repository contains the **frontend** (Next.js App Router + Tailwind CSS 4 + HeroUI). The backend (Express + MongoDB) lives in a separate repository.

---

## ✨ Key Features

### Public Pages
- **Home:** 8 Meaningful Sections including Hero Carousel, Featured Lawyers, Legal Categories, How It Works, Dynamic Platform Stats, Dynamic Testimonials, FAQ, and Call to Action.
- **Browse Lawyers:** Search, Filtering (fee, availability, specialization), Sorting, and Pagination. Fully responsive grid with skeleton loaders.
- **Lawyer Details:** Image Gallery (Embla Carousel), Bio, Verified Reviews, and Related Lawyers section.
- **Additional Pages:** About, Contact (saves to DB), Privacy Policy, Terms & Conditions, Refund Policy, and a detailed FAQ page.

### Authentication
- Email/password + Google OAuth (Better Auth).
- JWT-based secure session (7-day expiry).
- Role selection after registration (Client / Lawyer).
- **Demo Login Buttons** for quick access.

### Dashboards (Role-Based)
- **Client:** Hiring History (Stripe Payment), My Comments (Edit/Delete with Modals), Update Profile (Name, Image, and Password update).
- **Lawyer:** Incoming Hire Requests (Accept/Reject), Manage Legal Profile (Publish toggle, Stripe publishing fee, Multiple Image Gallery upload).
- **Admin:** Manage Users (Role change/Delete), Manage Lawyers (Publish/Delete), All Transactions, Analytics (Recharts: Bar, Line, Pie), and Settings (Password update).

### UI & Extras
- Fully responsive across Mobile, Tablet, and Desktop (Mobile Card View for all Data Tables).
- Admin Data Tables with Search, Sort, and Pagination.
- Dark mode support (system preference).
- Skeleton loaders, Custom 404, Error boundaries, Toast notifications.
- Cloudinary image upload.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | React 19 |
| Language | JavaScript |
| Styling | Tailwind CSS 4 |
| Component Library | HeroUI v3 |
| Animation | Motion (Framer Motion) |
| Carousel | Embla Carousel |
| Charts | Recharts |
| Auth | Better Auth (client) |
| Icons | React Icons, Gravity UI Icons |
| Notifications | React Hot Toast |
| Image Upload | Cloudinary (unsigned upload) |
| Payments | Stripe Checkout (Test mode) |
| Forms | Web3Forms |
| Deployment | Vercel |

---

## 📦 npm Packages

**Dependencies:**
- `@better-auth/mongo-adapter`
- `@heroui/react`, `@heroui/styles`
- `better-auth`
- `mongodb`
- `motion`
- `embla-carousel-react`, `embla-carousel-autoplay`
- `recharts`
- `next`, `react`, `react-dom`
- `react-hot-toast`
- `react-icons`

**Dev Dependencies:**
- `@tailwindcss/postcss`
- `babel-plugin-react-compiler`
- `eslint`, `eslint-config-next`
- `tailwindcss`

---

## ⚙️ Setup (Local Development)

### 1. Clone & install
```bash
git clone <client-repo-url>
cd client
npm install
```

### 2. Environment variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
MONGODB_URI=your_mongodb_atlas_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run
```bash
npm run dev
```
App runs on **http://localhost:3000**

*Note: Backend must be running on http://localhost:5000 for API calls to work.*

---

## 🔐 Demo Access

- **User:** `user@legitassist.com` / `User@1234`
- **Admin:** `admin@legitassist.com` / `Admin@1234`

*(Note: Passwords can be auto-filled using the Demo buttons on the Login page).*

To create a new admin manually: register normally, then set `role: "admin"` on the user document in MongoDB.

---

## 🚀 Deploy to Vercel

1. Push to GitHub.
2. Import project at [vercel.com](https://vercel.com).
3. Add all env vars from `.env.local`.
4. Deploy.
5. Update `NEXT_PUBLIC_API_URL` to your deployed backend URL.

---

## 📁 Project Structure

```text
app/
├── (auth)/                 login, register, select-role, redirect
├── about/                  about page
├── contact/                contact page (DB saved)
├── faq/                    detailed faq page
├── lawyers/                browse + [id] details (with gallery)
├── privacy/                privacy policy
├── refund/                 refund policy
├── terms/                  terms of service
├── dashboard/
│   ├── user/               hiring-history, comments, update-profile
│   ├── lawyer/             hiring-history, manage-legal-profile
│   └── admin/              manage-users, manage-lawyers, transactions, analytics, settings
├── api/                    auth + set-role routes
├── loading.jsx             404, error boundaries
└── layout.jsx

components/
├── auth/                   LoginForm, RegisterForm, RoleSelector
├── lawyers/                LawyerCard, Filters, HireModal, Comments
├── dashboard/              Sidebar, StatCard, HireStatusBadge
├── home/                   Hero, FeaturedLawyers, Categories, HowItWorks, Stats, Testimonials, FAQ, CTA
└── shared/                 NavBar, Footer, ImageUploader, Modals
```

---

## 🧪 Test Payment

**Stripe test card:**

- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

*Stripe is in test mode only — no real transactions will be processed.*

---

## 📄 License
MIT
