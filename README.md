# Growth X Admin

Staff portal for Growth X: sign in as an admin, review applications, send invites and reject applicants.
Split out of the applicant site (`../growth-x`); it talks to the same backend (`../growth-x-be`).

## Setup

```bash
npm install
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1   # must include the backend's /api/v1 prefix
npm run dev                                          # http://localhost:3001
```

Sign in at `/admin/login` (dev credentials are seeded by the backend — see `../growth-x-be/README.md`).

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npx tsc --noEmit`

See [CLAUDE.md](CLAUDE.md) for architecture notes.
