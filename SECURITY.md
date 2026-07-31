# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **wordsofvamshi@gmail.com**

Include the following details:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within **48 hours** and work to address the issue promptly.

## Security Measures

This project implements the following security practices:

### Environment & Secrets
- All API keys and secrets are stored in environment variables (`.env`, `.env.local`)
- `.env` files are excluded from version control via `.gitignore`
- An `.env.example` is provided as a template with placeholder values only

### Payment Security
- Payment processing is handled server-side via Razorpay's official SDK
- Payment signature verification uses HMAC-SHA256 cryptographic validation
- Razorpay secret keys are never exposed to the client

### HTTP Security Headers (via Vercel)
- `X-Frame-Options: DENY` — Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing
- `X-XSS-Protection: 1; mode=block` — Enables browser XSS filters
- `Referrer-Policy: strict-origin-when-cross-origin` — Controls referrer leakage
- `Permissions-Policy` — Restricts browser feature access
- `Strict-Transport-Security` (HSTS) — Enforces HTTPS with preload

### Authentication
- User authentication is handled by Clerk, a third-party auth provider
- No passwords or tokens are stored in the application

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| Latest  | ✅ Actively maintained |
