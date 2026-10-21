# Trade Marketplace

A **managed service** for licensed electricians doing side jobs. Trade Marketplace (TM) sets one fair fixed price,
takes the customer's payment up front, and pays the sparky per job through payroll with tax handled. Sparkies just
claim a job, charge materials to TM's Telfer account, do the work, upload the CoC and get paid.

Web rebuild (2026) of the 2022 SwiftUI/Firebase iOS app.

## Why fixed prices

- Tradies set the price → they undercut each other.
- Customers set the price → no good tradie will use it.
- **TM sets the price** → built *up* from the tradie's rate, so the sparky is never cut short and the customer still pays less than a call-out company.

```
tradie gross   = hours × tradie rate                   ($60/hr default)
labour cost    = tradie gross + on-costs               (12.5%: holiday pay 8%, KiwiSaver 3%, ACC)
ex GST         = (labour cost + materials at cost) + TM margin (20%)
customer pays  = ex GST + GST (15%)
```

All rates are editable at **Admin → Rates & settings** and are frozen onto each job when it's priced. The logic is
in `src/lib/pricing.ts`.

## Job lifecycle

```
REVIEW      customer posts job + photos; verified sparkies send blind estimates (hours + materials)
PRICED      TM sets hours/materials (sees every estimate + median) → fixed price sent to customer
BOOKABLE    customer paid up front → job on the board showing exactly what the sparky earns
ASSIGNED    first verified sparky to claim it gets it; sees address, contact, Telfer order no TM-xxxx, materials budget
            ↳ variation: sparky uploads photos → TM prices it → customer approves & pays before extra work
SUBMITTED   sparky uploads CoC (+ CoC no. + materials spent; TM is warned if over budget)
COMPLETED   customer confirms, TM signs off, or auto-release after 48 hrs → payout queued
            ↳ payouts exported as CSV for payroll (PAYE), then marked paid
CANCEL_REVIEW  customer cancels after paying → TM investigates → refund or reinstate
```

Before payment the customer can cancel freely.

## Run it

```bash
npm install
cp .env.example .env          # then set SESSION_SECRET to a long random string
npx prisma migrate dev        # creates prisma/dev.db
npm run db:seed               # demo data with a job at every stage (wipes the db)
npm run dev                   # http://localhost:3000
```

Demo accounts (all `@demo.test`, password in `prisma/seed.ts`): `admin`, `customer`, `customer2`, `sparky`,
`sparky2`, `sparky3` (unverified).

Make a real admin: sign up, then `npm run make-admin -- you@example.com`.

## Stack

Next.js 15 (App Router, server actions) · TypeScript · Tailwind 4 · Prisma + SQLite · cookie sessions (jose + bcrypt).
Runs on one box with no external services: photos and CoCs go in `./uploads`, data in `prisma/dev.db`.

```
prisma/schema.prisma        User, Job, Photo, Estimate, Variation, Payment, Coc, Payout, Message, Review, Settings
src/lib/pricing.ts          the pricing engine
src/lib/jobs.ts             job numbers, completion + payout, 48 h auto-release
src/app/actions/            server actions: jobs, tradie, admin, payments, messages, reviews, profile, auth
src/app/admin/              queues, tradie licence checks, payouts (+ CSV export), rates & settings
src/app/jobs/[id]/          one page, different panels for customer / assigned sparky / other sparkies / admin
```

## Not done yet — needed before real customers

- **Payments are TEST MODE.** `src/app/actions/payments.ts` marks payments paid without charging. Wire in Stripe (Checkout + webhook) and real refunds.
- **Payroll is a CSV export**, not a payroll integration.
- **Notifications** (email/SMS for new price, variation waiting, job claimed).
- Password reset; automatic EWRB lookup; Telfer slip import to check materials automatically.
- Uploaded files (incl. CoCs) are served to anyone with the unguessable URL — move to authenticated access before launch.
- Legal/tax: employment vs contractor status, GST registration, insurance, terms of service — see an accountant first.
- Hosting needs a persistent disk (SQLite + uploads), e.g. the Ubuntu server — not serverless.
