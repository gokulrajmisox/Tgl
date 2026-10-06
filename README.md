# Touch Grass Later (TGL) — Authentication & Motion System

**Learn. Build. Grow.**

A production-minded Next.js 14 application implementing TGL's complete
authentication experience (login, signup, password recovery, email
verification, OAuth callback, role-based access) plus the TGL premium
motion/interaction system — all in the TGL visual identity
(forest `#073B32`, emerald `#20C982`, charcoal `#15191E`, warm white).

## Quickstart

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase credentials
npm run dev                  # http://localhost:3000
```

Without Supabase credentials, every auth page renders a clearly marked
**configuration state** — authentication is never faked.

## Supabase setup (project "risk")

1. In the Supabase dashboard, open the SQL editor and run
   `supabase/migrations/20261006_profiles.sql`. It creates:
   - `public.profiles` (`id`, `email`, `full_name`, `role`, `referral_code`, …)
   - An **idempotent** `handle_new_user()` trigger — a profile row is created
     on signup, exactly once, always with role `student`.
   - Row Level Security: users read/update only their own profile.
   - A guard trigger so `role` can never be changed from the client —
     roles are granted via the dashboard / service role only.
2. **Authentication → Providers → Email**: enable "Confirm email".
3. **Google OAuth (optional)**: enable the Google provider, add the redirect URL
   `https://<your-domain>/auth/callback` in Supabase *and* in Google Cloud
   Console, then set `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true`.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (anon-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — **never** the service-role key |
| `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED` | `true` to show the Google button |
| `NEXT_PUBLIC_SITE_URL` | Public origin used to build safe redirect links |

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (staggered hero, scroll reveals) |
| `/login` | Two-column sign in, remember me, Google (if enabled) |
| `/signup` | Multi-step: Personal → Security → Referral & Terms |
| `/forgot-password` | Reset-link request (never reveals if an email exists) |
| `/reset-password` | New password + expired-link state |
| `/verify-email` | Instructions + resend with cooldown |
| `/auth/callback` | OAuth / email-link exchange, idempotent profile ensure |
| `/access-denied` | Role-gated areas, safe navigation home |
| `/session-expired` | Re-sign-in without losing saved work |
| `/dashboard` | Student home (role `student`) |
| `/mentor/dashboard` | Mentor home (role `mentor`) |
| `/admin` | Admin overview (role `admin`, calmer motion) |

Protected routes redirect to `/login?next=<safe-path>`; after sign-in users
land on their **server-verified** role home (`/dashboard`,
`/mentor/dashboard`, `/admin`). `next` values are validated against open
redirects (`src/lib/url.ts`).

## Security notes

- Roles come **only** from the server-side `profiles` table — never from form
  fields, URL params, or browser storage. Signup can only ever create `student`.
- The service-role key is never referenced anywhere in this codebase.
- Passwords are handled by Supabase Auth (bcrypt); never stored in plaintext.
- Server-side zod validation on all auth actions; friendly error mapping
  (network failures, invalid credentials, duplicates, expired links, rate limits).
- Middleware (`middleware.ts`) enforces authentication + role gates on every
  request; pages re-verify with `getSession()` (defense in depth).

## Motion system (`src/components/motion/`)

- `PageFade`, `Reveal`, `Stagger`/`StaggerItem` — page + scroll transitions
- `AnimatedNumber` — count-up on real value changes only
- `ProgressFill` — spring progress bars · `Pressable` — 1 → 1.02 → 0.97 physics
- Global `MotionConfig reducedMotion="user"` + CSS `prefers-reduced-motion`
  fallback; GPU-friendly transforms/opacity; skeletons instead of blank pages;
  toasts, modals, drawers per the TGL motion spec.

## Project structure

```
src/app/            # routes (App Router) + template.tsx (page transitions)
src/components/ui/  # Button, Input, PasswordInput, Checkbox, brand, strength
src/components/motion/    # animation primitives
src/components/feedback/  # Toaster, Modal, Skeleton, EmptyState
src/components/auth/      # AuthShell, GoogleButton, ConfigNotice
src/components/dashboard/# DashboardShell (sidebar + mobile drawer)
src/components/site/      # landing nav/footer
src/lib/auth/       # actions (server), roles, session, profiles, config
src/lib/supabase/   # browser / server / middleware clients
supabase/migrations/# profiles table + RLS
```

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm run start` — production build / serve
- `npm run typecheck` — `tsc --noEmit`
