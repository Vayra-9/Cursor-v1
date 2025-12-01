# PR: VAYRA Migration Day 1-4

## Title
feat: VAYRA migration day 1-4 (foundation, auth, core, pwa)

## Description
This PR implements the first 4 days of the VAYRA migration plan, moving from Cursor/Vite to a Google Anti-Gravity managed Next.js App Router architecture.

### 🚀 Day 1: Foundation
- **Next.js 14 App Router** bootstrap.
- **Tailwind CSS + ShadCN** configuration.
- **Vitest** setup for unit testing.
- Clean project structure (`/app`, `/lib`, `/types`).

### 🔐 Day 2: Authentication & User Data
- **Firebase Auth** integration (Google Sign-In).
- **Firestore User Schema** with RBAC (`starter`, `pro`, `premium`) and Grandfathering logic.
- **Auth Context** provider for global session management.
- Login/Signup pages and protected route logic.

### 🧮 Day 3: Core Calculators & Dashboard
- **Debt Calculator Engine**: Disposable income, payoff months estimation.
- **Payoff Strategies**: Avalanche and Snowball algorithms.
- **Dashboard UI**: Summary metrics, Quick Actions, and interactive Debt Calculator form.
- **Firestore Models**: CRUD for `debts` and `payments`.

### 📱 Day 4: PWA & Instant Expense Input
- **PWA Setup**: `next-pwa` config, Manifest, Service Worker, Install Banner.
- **Instant Expense Input**: Offline-first expense entry using IndexedDB.
- **Voice Input**: Web Speech API integration for quick logging.
- **Sync Engine**: Background sync queue for offline data.

## Type of Change
- [x] New feature (non-breaking change which adds functionality)
- [x] Breaking change (fix or feature that would cause existing functionality to not work as expected) - *Replaced Vite with Next.js*
- [x] This change requires a documentation update

## How Has This Been Tested?
- **Unit Tests**: `npm run test` passes for calculators and sync logic.
- **Manual Verification**:
  - PWA installability verified via DevTools.
  - Offline expense queuing and syncing verified.
  - Auth flow (Login/Signup) verified.
  - Calculator logic verified against known scenarios.

## Checklist:
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally
