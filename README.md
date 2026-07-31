<div align="center">

# 📖 React E-Commerce Storefront

**A production-grade e-commerce storefront for an indie book, built with React 19, Vite, and Razorpay.**

[Live Demo](https://wordsofvamshi.com) · [Report Bug](https://github.com/Yashasm18/react-ecommerce-storefront/issues) · [Request Feature](https://github.com/Yashasm18/react-ecommerce-storefront/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF?style=for-the-badge&logo=razorpay&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## Overview

A full-stack e-commerce storefront designed and built from scratch to sell an indie poetry book — **"You Made Me Quiet"** by Vamshi. This isn't a template or a tutorial clone — it's a **production application** actively serving real customers with live payment processing, automated order notifications, and transactional emails.

> **Live at:** [wordsofvamshi.com](https://wordsofvamshi.com)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client (React 19 + Vite)        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Clerk    │  │ Razorpay │  │ React Components  │  │
│  │ Auth SDK │  │ Checkout │  │ (SPA)             │  │
│  └────┬─────┘  └────┬─────┘  └───────┬───────────┘  │
│       │              │                │              │
├───────┼──────────────┼────────────────┼──────────────┤
│       │     Vercel Serverless Functions              │
│  ┌────┴────────┐ ┌───┴──────────┐ ┌──┴────────────┐ │
│  │ /api/create │ │ /api/verify  │ │ /api/send     │ │
│  │ -order.js   │ │ -payment.js  │ │ -confirmation │ │
│  └─────────────┘ └──────────────┘ └───────────────┘ │
│         │                │                │          │
├─────────┼────────────────┼────────────────┼──────────┤
│    Razorpay API    HMAC-SHA256      Resend API       │
│                    Verification     (Emails)         │
└─────────────────────────────────────────────────────┘
```

---

## Features

### E-Commerce Core
- **Shopping cart** with add/remove, quantity controls, and persistent state
- **Multi-edition support** — Standard & Author's Edition with different pricing
- **Buy Now & Cart checkout** flows
- **Responsive checkout** with delivery form and order summary

### Payment Integration
- **Razorpay payment gateway** — live payment processing in INR
- **Server-side order creation** via Vercel serverless functions
- **Cryptographic payment verification** using HMAC-SHA256 signature validation
- **Error handling** — graceful recovery for failed/cancelled payments

### Authentication & Security
- **Clerk authentication** — sign-in/sign-up with social providers
- **Auth-gated actions** — cart and checkout require authentication
- **HTTP security headers** — HSTS, X-Frame-Options, CSP, XSS protection
- **Environment variable isolation** — zero hardcoded secrets

### Notifications & Emails
- **Web3Forms integration** — order notifications to the author
- **Resend API** — automated HTML confirmation emails to buyers
- **Event tracking** — Chapter 1 read tracking, review submissions

### UI/UX
- **Fully responsive** — mobile-first design, works on all screen sizes
- **Image carousel** — auto-rotating hero section with 8 book photos
- **Interactive hearts animation** — cursor-following heart emojis
- **Reader moments gallery** — images and videos with maximize modal
- **Smooth scroll navigation** — section-based with active state indicators
- **Search modal** — keyword search across all site sections
- **Toast notifications** — feedback for cart actions
- **Policy modals** — Privacy, Refund, Shipping, and Terms of Service

### SEO & Performance
- **Open Graph & Twitter Card** meta tags for social sharing
- **JSON-LD structured data** — Book schema for search engines
- **Sitemap & robots.txt** — search engine crawling support
- **Optimized build** — source maps disabled, module preload disabled

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI components & state management |
| **Build Tool** | Vite 8 | Dev server, HMR, production bundling |
| **Authentication** | Clerk | User sign-in/sign-up & session management |
| **Payments** | Razorpay | Payment processing & order creation |
| **Serverless API** | Vercel Functions | Server-side payment logic & email dispatch |
| **Email** | Resend | Transactional order confirmation emails |
| **Forms** | Web3Forms | Contact forms & notification delivery |
| **Icons** | Lucide React | SVG icon library |
| **Deployment** | Vercel | Hosting, CI/CD, serverless functions |

---

## Project Structure

```
react-ecommerce-storefront/
├── api/                          # Vercel serverless functions
│   ├── create-order.js           # Razorpay order creation
│   ├── verify-payment.js         # HMAC-SHA256 payment signature verification
│   └── send-confirmation.js      # Resend email dispatch
├── public/                       # Static assets
│   ├── book-cover*.png           # Product images
│   ├── reader-dm*.jpg            # Reader testimonial screenshots
│   ├── reader-video*.mp4         # Reader testimonial videos
│   ├── sitemap.xml               # SEO sitemap
│   └── robots.txt                # Search engine directives
├── src/
│   ├── App.jsx                   # Main application component (~2100 lines)
│   ├── App.css                   # Component-specific styles
│   ├── index.css                 # Global styles & design tokens
│   └── main.jsx                  # Entry point with Clerk provider
├── .env.example                  # Environment variable template
├── vercel.json                   # Security headers & deployment config
├── vite.config.js                # Vite build configuration
├── SECURITY.md                   # Security policy & practices
└── LICENSE                       # MIT License
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Accounts on: [Razorpay](https://razorpay.com), [Clerk](https://clerk.com), [Web3Forms](https://web3forms.com), [Resend](https://resend.com)

### 1. Clone the repository

```bash
git clone https://github.com/Yashasm18/react-ecommerce-storefront.git
cd react-ecommerce-storefront
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
cp .env.example .env.local
```

Edit both files and fill in your API keys. See [`.env.example`](.env.example) for details.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for production

```bash
npm run build
npm run preview   # Preview the production build
```

---

## 🔒 Security

This project follows security best practices:

- ✅ **No hardcoded secrets** — all API keys use environment variables
- ✅ **Server-side payment processing** — Razorpay secrets never reach the client
- ✅ **HMAC-SHA256 signature verification** — prevents payment tampering
- ✅ **Security headers** — HSTS, X-Frame-Options, nosniff, XSS protection
- ✅ **Input validation** — form validation with email, phone, and length checks
- ✅ **Content protection** — context menu and dev tools shortcuts disabled in production

See [SECURITY.md](SECURITY.md) for the full security policy and vulnerability reporting.

---

## 🚢 Deployment

This project is deployed on **Vercel** with automatic deployments on push.

### Deploy to Vercel

1. Import this repository on [Vercel](https://vercel.com/new)
2. Add all environment variables from `.env.example` to the Vercel dashboard
3. Deploy — Vercel auto-detects the Vite framework

### Environment Variables (Vercel Dashboard)

| Variable | Where to Get It |
|----------|----------------|
| `RAZORPAY_KEY_ID` | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `VITE_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` |
| `VITE_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) |
| `VITE_WEB3FORMS_KEY` | [Web3Forms](https://web3forms.com) |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by [Yashas M](https://github.com/Yashasm18)**

</div>
