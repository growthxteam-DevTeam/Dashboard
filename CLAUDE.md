# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server (http://localhost:3001 — 3000 is the applicant app, ../growth-x)
npm run build      # production build (also type-checks)
npm run start      # serve the production build (port 3001)
npm run lint       # eslint — the script is bare `eslint`, not `next lint`
npx tsc --noEmit   # type-check only — faster than a full build
```

There is no test setup in this project. `npm run lint` baseline: 0 errors + 1 warning (`redux/features/api/apiSlice.ts`,
the deliberate `window.location.href` full reload on 401 that wipes the session). If `tsc` reports errors about pages that
no longer exist, they come from stale generated types in `.next/` — delete `.next/types` and `.next/dev/types`.

## What this is

The Growth X **staff portal**, split out of `../growth-x` (the applicant site). It is a small, standalone Next.js 16
App Router app (React 19, TypeScript strict, Tailwind v4, shadcn `base-nova`). Path alias `@/*` → project root. Everything
unrelated to staff was removed on purpose — don't re-add applicant/marketing code here; keep it in `../growth-x`.

Routes (all keep the `/admin` prefix, so the URLs match what the backend docs and bookmarks already use):

- `/` and `/admin` redirect to `/admin/applications`.
- `app/admin/login/` — admin sign-in. `useAdminLogin` -> `authApi.adminLogin` -> `POST /admin/auth/login`; seeded dev
  credentials are in `../growth-x-be/README.md`. Stores the JWT with `setCredentials` and a user whose
  `role.title` is `ADMIN_ROLE_TITLE`.
- `app/admin/(portal)/` — wraps its pages in `AdminShell`, which lays out `AdminSidebar` (left column on desktop, fixed bottom bar
  below `lg`; links come from `SIDEBAR_LINKS` in `(portal)/_constants`, add new admin pages there) and `AdminNavbar` (admin
  name, language, theme, log out) around the page, and sends anyone without an admin session to `/admin/login`
  (UI gate only; the backend's admin JWT is the real protection).
- `app/admin/(portal)/applications/` — the review table: every application, paginated (`ADMIN_APPLICATIONS_PAGE_SIZE`),
  with a details dialog (all submitted fields), "Send invite"/"Resend invite" (`POST /admin/applications/:id/invite`,
  emails the GS code) and "Reject" behind a confirmation dialog (`POST /admin/applications/:id/reject`, emails a
  rejection and sets status `rejected`).
- `app/admin/(portal)/dashboard/` — manages the learner dashboard's content (tabs: Program banner, Announcements,
  Schedule, To-do). Banners (`PUT /admin/dashboard/banners`, one per program + cohort) and items
  (`/admin/dashboard/items?type=`: announcements, events, assignments) each get a table with add/edit dialogs
  (react-hook-form + zod; form fields are strings, `""` in program/cohort means "everyone") and a delete confirmation.
  `PROGRAM_VALUES` / `COHORT_VALUES` in `_constants` mirror the onboarding form and the backend's `dashboard.constants.ts`.
  Text is English only.

The feature-slice convention is `page.tsx` (server component that only assembles) + `_components/`, `_hooks/`, `_constants/`,
`_types/`, `_lib/`; logic lives in one `use<Feature>` hook.

## Data / state

- Redux Toolkit + RTK Query. `redux/features/api/apiSlice.ts` is the only `createApi`; add endpoints with
  `apiSlice.injectEndpoints` in a per-feature `*Api.ts` (`authApi`: `adminLogin`; `adminApi`: `getAdminApplications`,
  `inviteApplicant`, `rejectApplicant`). `AdminApplication` in `adminApi.ts` mirrors the backend's grouped application
  entity (not the flat request payload).
- `baseUrl` is `process.env.NEXT_PUBLIC_BASE_URL` (`.env.local` / `.env.production`); it must include the backend's
  `/api/v1` prefix. `prepareHeaders` attaches `auth.token`. A 401 from anything except `adminLogin` dispatches `logout()` and
  redirects to `/admin/login`.
- The only slice is `auth`, persisted with redux-persist (`token`, `user`). Use the typed `useAppDispatch` /
  `useAppSelector` from `redux/app/hooks.ts`.
- The backend allows all CORS origins, so this app can run on a different origin from `../growth-x`.

## i18n

`next-intl` with a cookie locale (`i18n/`, `en` + `fr`; `LanguageSwitcher` sets it). `messages/en.json` and `fr.json` hold
only what this app reads: `Admin.*`, `Header.language`, `NotFound`, two `Validation` keys, and `Onboarding.options` (the
labels for the stored option values — program, cohort, gender… — shown in the table and details dialog, via
`useOptionLabel`). Keep both locales in sync (same keys and `{placeholders}`). If the applicant form in `../growth-x` gains
a new option value, add its label to `Onboarding.options` here too (unknown values fall back to the raw stored value).

## Styling

Tailwind v4 is configured entirely in `app/globals.css` (no `tailwind.config.*`); light/dark token sets live there and
`.dark` is toggled by `next-themes`. Use tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `bg-tint`,
`bg-page`, `bg-sidebar`), not hardcoded `bg-white`/`gray-*`/hex. In dark mode `primary` is gold, so use
`text-primary-foreground` on `bg-primary`. The `.admin-form` class (login card) restyles inputs.

`components/ui/` is shadcn/ui, treated as generated — add primitives with the shadcn CLI (only the ones this app uses are
present). `components/common/` = `Avatar`, `LanguageSwitcher`, `ThemeToggle`; `components/shared/` = `CustomFormField`
(react-hook-form text input only), `SubmitButton`, `ScreenLoader`. Fonts: local Google Sans Flex (24pt) via
`next/font/local`.

## Next.js version note

`package.json` pins `next@16.3.1` — newer than this model's training data. Before writing App Router code, read the bundled
docs in `node_modules/next/dist/docs/` and heed deprecation notices. `AGENTS.md` is generated and re-added by `next dev` —
don't edit it away.
