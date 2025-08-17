# VAYRA – Product Specification

## Purpose
VAYRA is a premium SaaS that helps users eliminate debt, build savings, and grow income. It combines AI coaching, behavioral psychology, and a polished UI/UX to deliver a transformative experience.

## Core Features (high level)
- Firebase Auth + plan-based access (Free, Starter, Pro, Premium)
- Firestore data model with secure per-user isolation
- Static pricing matrix (single source of truth) + grandfathered badge
- Debt Dashboard, Payment Tracker, Payoff Strategy (snowball/avalanche)
- DTI Calculator, Advanced Analytics, Financial Calendar
- Income & Skill Tracker, Recurring Smart Tasks
- AI Money Coach (Pro+), tips/motivation, education micro-course
- CSV/manual import, PDF report export
- i18n (react-i18next), multi-currency, PWA offline/install
- Accessibility (WCAG AA), Lighthouse ≥ 90 mobile/desktop

## How It Works (flow)
1) User signs in via Firebase Auth.
2) On first login, user doc is seeded (profile, access, timestamps).
3) Plan tier gates modules (Free shows Lite + blurred previews; Pro/Premium unlocks full).
4) Pricing & features render from `src/data/pricing.ts`.
5) Dashboards read/write Firestore; charts update live.
6) AI endpoints are available for Pro+ with usage limits.
7) PWA is installable; offline cache for shell + critical views.
8) Security: Firestore rules restrict to own `/users/{uid}/…`.

## Quality Goals
- Pixel-perfect responsive UI, dark/light/system modes
- Smooth animations (Framer Motion), premium typography
- a11y checks pass, Lighthouse ≥ 90, no critical console errors
