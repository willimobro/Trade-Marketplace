# Trade Marketplace

Builderscrack-style job marketplace for **individual licensed tradies** (sparkies first), not just businesses.
Web rebuild (2026) of the 2022 SwiftUI/Firebase iOS app - same idea, screens, colours and data model.

**Stack:** Next.js 15 (App Router, server actions) · TypeScript · Tailwind 4 · Prisma + SQLite · cookie sessions (jose JWT + bcrypt).
Runs on one box with no external services - photos go in `./uploads`, data in `prisma/dev.db`.

## Run it

```bash
npm install
cp .env.example .env          # then set SESSION_SECRET to a long random string
npx prisma migrate dev        # creates prisma/dev.db
npm run db:seed               # optional demo data (wipes the db)
npm run dev                   # http://localhost:3000
```

Demo accounts (after seeding) all use the password in `prisma/seed.ts`:
`customer@demo.test`, `customer2@demo.test`, `sparky@demo.test`, `sparky2@demo.test`, `plumber@demo.test`.

## How it works

| Who | Can do |
|---|---|
| Customer | Post a job (up to 6 photos), see every quote on it, message each quoting tradie, accept one, mark complete, leave a review |
| Tradie | Browse/filter open jobs, send one quote per job, message the customer about their own quote, see won jobs on the dashboard |

- Tradies only ever see their **own** quote on a job; customers see all of them.
- Phone/email are only shown to both sides **after a quote is accepted**.
- Job status: `OPEN` → `ASSIGNED` (quote accepted) → `COMPLETED` → review. Customers can `CLOSE` an open job.

## Licence verification

Tradies sign up with their registration number and show **"Licence pending check"** until verified.
Check the number on the [EWRB public register](https://www.ewrb.govt.nz/), then:

```bash
npm run verify-licence                         # list tradies waiting for a check
npm run verify-licence -- someone@example.com  # mark verified
npm run verify-licence -- someone@example.com --revoke
```

Changing the registration number on a profile resets the badge.

## Layout

```
prisma/schema.prisma      User, Job, Photo, Quote, Message, Review
src/app/actions/          server actions (auth, jobs, quotes, messages, reviews, profile)
src/app/                  pages: / jobs jobs/new jobs/[id] dashboard profile tradies/[id] login signup
src/app/uploads/[file]    serves uploaded photos
src/lib/                  db, session, uploads, constants (regions, categories)
scripts/verify-licence.ts
```

## Not done yet

- Email notifications (new quote / new message)
- Automatic EWRB register lookup
- Password reset
- Payments / lead fees - no monetisation yet
- Hosting: needs a box with a persistent disk (SQLite + uploads), e.g. the Ubuntu server, not serverless
