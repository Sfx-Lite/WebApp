# SFx Lite Frontend

A responsive React frontend for the SFx Lite remittance & neobank platform. Enables users to manage wallets, transfer money, complete KYC, and receive support — all grounded in a double-entry ledger backend.

Stack: React 19 · TypeScript · Vite · Tailwind CSS · Redux Toolkit + RTK Query · React Router · Axios · deployed as a PWA with offline support.

> Built as part of the SFx Lite Intern Build Program.

## Table of contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Development](#development)
- [Architecture](#architecture)
- [State management](#state-management)
- [Routing](#routing)
- [API communication](#api-communication)
- [Key user flows](#key-user-flows)
- [Debugging & deployment](#debugging--deployment)

## What it does

The frontend supports the core user journeys:

- **Sign up & sign in** — email + password or Google OAuth, followed by transaction PIN verification.
- **Wallet & deposit** — display deposit address & QR, detect incoming USDC, show balance.
- **Send money** — transfer to other SFx users; fee-aware, with review & PIN confirmation.
- **Withdraw** — on-chain USDC withdrawal to external address; fee-aware, idempotent.
- **KYC** — document & selfie capture with OCR and face detection; status tracked and notified.
- **Transaction history** — paginated ledger view with filters.
- **Support chat** — AI assistant grounded in ingested docs (RAG).
- **Settings & security** — profile, password, PIN, 2FA (email OTP).

## Tech stack

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework        | React 19.2.7                                                   |
| Language         | TypeScript 6.0.2                                               |
| Build            | Vite 8.1.1                                                     |
| Styling          | Tailwind CSS 4.3.2 + next-themes (dark mode)                   |
| State            | Redux Toolkit 2.12.0 + RTK Query                               |
| Routing          | React Router 8.2.0                                             |
| HTTP             | Axios 1.18.1 with auth interceptors                            |
| Forms            | React Hook Form 7.82.0 + Zod 4.4.3                             |
| UI Kit           | shadcn + Base UI React 1.6.0                                   |
| Icons            | Lucide React 1.24.0 + React Icons 5.7.0                        |
| Document capture | tesseract.js (OCR), face-api.js (face detection), react-webcam |
| Notifications    | Sonner 2.0.7                                                   |
| Animations       | Motion 12.42.2                                                 |
| QR codes         | qrcode.react 4.2.0                                             |
| PWA              | Vite PWA Plugin 1.3.0 (service worker, offline caching)        |
| Linting          | ESLint 10.6.0 + TypeScript ESLint 8.62.0                       |
| Package manager  | Bun 1.0+                                                       |

## Project structure

```
src/
├── api/            # RTK Query endpoints, Axios config (with token refresh)
├── components/     # React components by feature (Kyc/, Chat/, Form/, ui/, etc.)
├── layouts/        # Page wrappers (Dashboard, Onboarding, Chat)
├── pages/          # Route-level components (Home, SendMoney, Withdraw, History, etc.)
├── store/          # Redux slices (auth, kyc, sendMoney, withdraw, topBar)
├── lib/            # Types, Zod schemas, utilities, animations
├── hooks/          # Custom hooks (usePwa, useIsMobile, useKycStatus, useBeneficiaries)
├── utils/          # Validators, analytics, KYC helpers
├── contexts/       # Theme provider (dark/light mode)
├── App.tsx         # Root component
├── main.tsx        # Vite entry point with Redux + Router setup
└── index.css       # Global styles
```

## Quick start

**Prerequisites:** Node.js 20+, Bun 1.0+.

### 1. Install & env

```bash
git clone <repo>
cd WebApp
bun install
cp .env.example .env.local
VITE_API_URL=https://dev-api-sfx-lite.onrender.com/api/v1
```

### 2. Run

```bash
bun run dev
# Open http://localhost:5173
```

### 3. Build

```bash
bun run build       # Type-check + minify to dist/
bun run preview     # Test prod build locally
```

## Development

### Code quality

```bash
bun run lint        # ESLint check
bun run lint:fix    # Auto-fix issues
```

Husky runs linting on staged files before commit.

### Common scripts

| Command            | Purpose                 |
| ------------------ | ----------------------- |
| `bun run dev`      | Dev server (Vite HMR)   |
| `bun run build`    | Production build        |
| `bun run preview`  | Preview prod build      |
| `bun run lint`     | ESLint check            |
| `bun run lint:fix` | Auto-fix linting issues |

## Architecture

The frontend is organized around React Router with layout-based nesting:

```
                          ┌─ Router (React Router)
                          │
                          ├─ Public Routes (OnboardingLayout)
                          │  ├─ /login, /register
                          │  ├─ /forgot-password, /reset-password/:token
                          │  └─ Guard: PublicRoute (logged-out only)
                          │
                          └─ Protected Routes (DashboardLayout / ChatLayout)
                             ├─ /, /rates, /history, /settings, /notifications
                             ├─ /addmoney, /sendmoney, /withdraw (multi-page flows)
                             ├─ /kyc (document + selfie capture)
                             ├─ /support (AI chat)
                             └─ Guard: ProtectedRoute (token + PIN required)
                                │
                                ▼
                       Redux Store (auth, forms, UI state)
                       RTK Query (wallet, tx, users, etc.)
                                │
                                ▼
                       Axios (with token refresh interceptor)
                                │
                                ▼
                       SFx Lite Backend API
```

**Key layers:**

- **Router**: Public (login/register) vs. Protected (dashboard/chat) routes. `ProtectedRoute` checks token & PIN.
- **Layouts**: `OnboardingLayout` (auth pages), `DashboardLayout` (main app), `ChatLayout` (support).
- **Redux**: Slices for auth state, KYC staging, and multi-page form state. RTK Query for API caching.
- **Axios**: Single instance with Bearer token injection and automatic 401 refresh logic.
- **Components**: Feature-based folders (Kyc/, Chat/, etc.) + shared UI kit in `components/ui/`.

## State management

Redux Toolkit + RTK Query manage all state:

- **Redux slices**: `auth` (user, token, PIN status persisted to localStorage), `kyc` (document staging), `sendMoney` & `withdraw` (multi-page form state), `topBar` (transient UI).
- **RTK Query**: Automatic caching for wallet, transactions, users, beneficiaries, notifications, chat, fees, withdrawals.
- **Auth persistence**: Token and user stored in localStorage; PIN status in sessionStorage (session-scoped only).
- **Multi-page forms**: Redux preserves form state across navigation, allowing users to return to send/withdraw flows without losing data.

## Routing

Router uses **layout-based nesting**:

- **Onboarding layout**: Public routes (login, register, password reset).
- **Dashboard layout**: Main app (home, history, settings, KYC, send/withdraw/deposit flows).
- **Chat layout**: Support chat routes.

**Route guards:**

- `ProtectedRoute`: Requires valid JWT token + PIN verification; redirects to `/login` otherwise.
- `PublicRoute`: Logs out authenticated users to prevent access.

## API communication

All requests flow through Axios with automatic Bearer token injection from Redux state. On 401 response, the interceptor queues the request, refreshes the token via `/auth/refresh`, updates localStorage, and retries — transparent to components. RTK Query handles caching and deduplication.

## Key user flows

**Login & PIN verification**  
User logs in via email or Google → token stored in localStorage → PIN verification required (session-scoped) before accessing protected routes.

**Send money**  
User selects recipient (username validated) → enters amount (fee calculated automatically) → reviews details and verifies PIN → creates ledger entry with idempotency key → shown confirmation and reset to dashboard.

**KYC**  
User captures document (OCR via tesseract.js extracts text) → captures selfie (face detection via face-api.js validates presence) → reviews extracted fields → submits to backend (Cloudinary) → status machine (unverified → pending → under review → verified/rejected)

**Support chat**  
User lists past conversations or starts new → sends message → backend embeds question, retrieves context from pgvector → response streams back; conversation persists for follow-ups.

## Debugging & deployment

Use the Redux DevTools browser extension to inspect state and time-travel through actions.

```bash
bun run build   # Produces dist/
```

The `dist/` directory is ready for deployment to Vercel (configured via `vercel.json`). The app runs as a PWA with offline support; service worker caches assets and API responses. Set `VITE_API_URL` in `.env.local` to point to the backend.

## Contributing

1. Branch from `main`
2. Keep components focused; add types in `lib/types/` for new data structures.
3. Use Redux slices for global state, RTK Query for API calls.
4. Run `bun run lint:fix` before committing.
5. Husky enforces linting on staged files.

---
