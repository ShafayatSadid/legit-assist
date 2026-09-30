# LegalEase — Client

> **Find & Hire Expert Legal Counsel** — A modern online lawyer hiring platform built with Next.js 16, React 19, and HeroUI.

**Live URL:** https://legit-assist.vercel.app 

---

## 📌 Purpose

LegalEase connects legal seekers (clients) with skilled lawyers. Clients browse and hire legal experts, lawyers manage their listings after a one-time publishing fee, and admins oversee users, transactions, and platform analytics.

This repository contains the **frontend** (Next.js App Router + Tailwind CSS 4 + HeroUI). The backend (Express + MongoDB) lives in a separate repository.

---

## ✨ Key Features

### Public
- **Home** — Hero carousel, Featured Lawyers, Top Legal Experts, Legal Categories (all animated)
- **Browse Lawyers** — Search by name/specialization, filter by fee range & availability, sort, pagination (9 per page)
- **Lawyer Details** — Full profile with reviews, hire modal, role-gated actions

### Authentication
- Email/password + Google OAuth (Better Auth)
- JWT-based session (7-day expiry)
- Role selection after registration (Client / Lawyer)

### Dashboards (role-based)
- **Client** — Hiring history with Stripe payment, My Comments (edit/delete), Update Profile
- **Lawyer** — Incoming hire requests (accept/reject), Manage Legal Profile (publish toggle, Stripe publishing fee)
- **Admin** — Manage Users (role change, delete), All Transactions, Analytics (users, lawyers, hires, revenue)

### Extras
- Dark mode support (system)
- Skeleton loaders, custom 404, error boundary, toast notifications
- Fully responsive (mobile-first)
- Cloudinary image upload
- Stripe Checkout (test mode)

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
| Auth | Better Auth (client) |
| Icons | React Icons, Gravity UI Icons |
| Notifications | React Hot Toast |
| Image Upload | Cloudinary (unsigned upload) |
| Payments | Stripe Checkout |
| Deployment | Vercel |

---

## 📦 npm Packages

**Dependencies:**
- `@better-auth/mongo-adapter`
- `@heroui/react`, `@heroui/styles`
- `better-auth`
- `mongodb`
- `motion`
- `next`, `react`, `react-dom`
- `react-hot-toast`
- `react-icons`

**Dev Dependencies:**
- `@tailwindcss/postcss`
- `babel-plugin-react-compiler`
- `eslint`, `eslint-config-next`
- `tailwindcss`

---

## ⚙️ Setup

### 1. Clone & install

```bash
git clone <client-repo-url>
cd client
npm install