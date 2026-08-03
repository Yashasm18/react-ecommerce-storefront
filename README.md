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
![CI](https://img.shields.io/github/actions/workflow/status/Yashasm18/react-ecommerce-storefront/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI)

[![Amazon](https://img.shields.io/badge/Amazon-Available-FF9900?style=for-the-badge&logo=amazon&logoColor=white)](https://www.amazon.com/dp/B0H3M7Y1JC)
[![Flipkart](https://img.shields.io/badge/Flipkart-Available-2874F0?style=for-the-badge&logo=flipkart&logoColor=white)](https://www.flipkart.com/you-made-me-quiet-journey-love-care-silent-feelings/p/itm47a6a816e5730?pid=9798905105067)
[![Notion Press](https://img.shields.io/badge/Notion%20Press-Published-E03C31?style=for-the-badge&logo=bookstack&logoColor=white)](https://notionpress.com/in/read/you-made-me-quiet)

<br>

### 🏆 #1 Notion Press Bestseller · 30,000+ Copies Sold
###     Made for readers who actually read through their heart and maintain the same passion!

*As of July 2026*

</div>

---

## Overview

A full-stack e-commerce storefront designed and built from scratch to sell an indie poetry book — **"You Made Me Quiet"** by Vamshi. This isn't a template or a tutorial clone — it's a **production application** actively serving real customers with live payment processing, automated order notifications, and transactional emails.

> **Live at:** [wordsofvamshi.com](https://wordsofvamshi.com)

**Also available on [Amazon](https://www.amazon.com/dp/B0H3M7Y1JC), [Flipkart](https://www.flipkart.com/you-made-me-quiet-journey-love-care-silent-feelings/p/itm47a6a816e5730?pid=9798905105067), and [Notion Press](https://notionpress.com/in/read/you-made-me-quiet)** — the book is sold across India's top online marketplaces, not only through this website.

---

## 📖 About "You Made Me Quiet"

> *"You Made Me Quiet"* is a contemporary poetry collection by **Vamshi** exploring love, care, silent feelings, and emotional self-discovery.

- ✍️ **Author:** Vamshi ([@wordsofvamshi](https://instagram.com/wordsofvamshi))
- 📚 **Editions:** Standard Paperback & Author's Signed Edition
- 🏢 **Publisher:** Notion Press
- 🌐 **Official Store:** [wordsofvamshi.com](https://wordsofvamshi.com)

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

## Visual Showcase

| Desktop Storefront Experience | Mobile Responsive View |
| :---: | :---: |
| ![Desktop Storefront UI](public/preview-desktop.png) | ![Mobile Responsive View](public/preview-mobile.png) |
| *Desktop hero section with live book showcase & navigation* | *Responsive mobile layout with top bestseller badges & quick shop* |


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

## Design & UI/UX Highlights

- 🍷 **Literary Warm Aesthetic** — Palette tailored specifically to match the emotional tone of the poetry book.
- ✨ **Interactive Floating Hearts** — Dynamic cursor-following particle animation for high engagement.
- 📱 **Mobile-First UX** — Slide-out responsive cart drawer, accessible tap targets, and smooth section transitions.
- 🖼️ **Reader Moments Gallery** — Photo and video gallery grid with interactive full-screen preview modals.
- 📖 **Interactive Chapter Preview** — Instant sample reader allowing users to experience Chapter 1 directly on-site.

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

## ⚡ Performance & Core Web Vitals

Built and optimized for high-speed performance, accessibility, and search engine visibility:

| Metric | Score | Detail |
|---|:---:|---|
| 🟢 **Performance** | **98+** | Optimized asset delivery, zero layout shift, ultra-fast initial render |
| 🟢 **Accessibility** | **100** | Full keyboard support, screen-reader friendly, contrast compliant |
| 🟢 **Best Practices** | **100** | Modern JS standards, HTTPS security, zero console warnings |
| 🟢 **SEO** | **100** | Open Graph meta tags, Twitter Cards, structured `Book` schema |

---

## ⭐ Reader Praise & Recognition

> *"A poetry book that touches the quietest corners of your heart."* — **Reader Review**

> *"Seamless shopping experience with instant confirmation and fast delivery."* — **Verified Buyer**

- 🏆 **#1 Notion Press Bestseller**
- 📦 **30,000+ Copies Sold**
- 🌍 **Available Worldwide** across Amazon, Flipkart, Notion Press, and [wordsofvamshi.com](https://wordsofvamshi.com)

---

## Security

This project follows security best practices:

- ✅ **No hardcoded secrets** — all API keys use environment variables
- ✅ **Server-side payment processing** — Razorpay secrets never reach the client
- ✅ **HMAC-SHA256 signature verification** — prevents payment tampering
- ✅ **Security headers** — HSTS, X-Frame-Options, nosniff, XSS protection
- ✅ **Input validation** — form validation with email, phone, and length checks
- ✅ **Content protection** — context menu and dev tools shortcuts disabled in Production
- ✅ **CI/CD pipeline** — automated lint, build, and secret scanning on every push

See [SECURITY.md](SECURITY.md) for the full security policy and vulnerability reporting.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 💼 Want a Website Like This?

**Need a production-ready e-commerce store, portfolio, or business website?**
I build fast, secure, and beautiful web applications from scratch — tailored to your brand.

📧 **Get in touch:** [yashasm1807@gmail.com](mailto:yashasm1807@gmail.com)

Whether it's a storefront with payment integration, a personal brand site, or a custom web app — let's build something great together.

---

**Built & engineered by [Yashas M](https://github.com/Yashasm18)**

</div>
