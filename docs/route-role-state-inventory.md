# Route, role and state inventory

Reviewed 2026-10-21 by static source inspection. This document is not a runtime test report. The homepage and local demo route were being edited concurrently; their entries describe the inspected snapshot. No application behavior changed for this inventory.

## Route coverage

| Route | Access / role | Existing states and review targets |
| --- | --- | --- |
| `/` | Public | Browse, search view, menu dialog, horizontal examples/categories; examples are not live jobs. Homepage changes are outside this review. |
| `/for-tradies` | Public | Current settings-based earnings examples, onboarding CTA, estimate/claim/completion explanation. Inspect long rates and multi-column sections inside the narrow frame. |
| `/login` | Guest; signed-in users redirect to dashboard | Empty/entered fields, validation/server error, pending, retained inputs, recovery link. |
| `/signup` | Guest; signed-in users redirect to dashboard | Identity step, account-details step, customer/tradie selection, region, trade selection, required electrical versus optional other registration, back navigation, pending/error with retained values. |
| `/recovery` | Public preview | `state=request`, `sent`, `expired`, `reset`, `complete`; unknown state falls back to request. No real recovery, email or password changes. |
| `/support` | Public preview | Guidance including connection/session problems, sample topic selection and review/back. No support ticket is submitted. |
| `/notifications` | Public preview | Fictional examples, local read-state, empty, connection-error and retry; no notification service. |
| `/profile` | Authenticated | Customer/admin fields; tradie verification/registration information; avatar selection, validation, saving and retained inputs. |
| `/dashboard` | Authenticated customer/tradie; admin redirects to `/admin` | Customer active/status filters, empty/populated jobs and next actions; tradie assignments, private estimates and pending/paid payroll. History expansion remains deferred. |
| `/jobs` | Guest/tradie; customers redirect dashboard, admins admin | Query/trade/region/stage filters, all/saved/recent collections, empty results, local-storage errors, missing/failed photos, estimate versus claimable jobs, full detail links. |
| `/jobs/new` | Authenticated customer; other roles receive account guidance | Job fields, photos, draft recovery/storage unavailable, review/back, invalid input/upload, pending and action errors. Four-category selector retained through draft recovery and review. Saved receipt navigates to the persisted job. |
| `/jobs/[id]` | Authenticated; owner, assigned tradie, admin; other tradies only eligible public stages | Missing/unauthorized customer -> not found; other-tradie stale/unavailable state. Role/status-specific estimates, claims, customer prices, test-payment links, messages, variations, CoC, completion, cancellation, reviews and payroll. See state matrix below. |
| `/pay/[paymentId]` | Payment's owning customer | Missing/unauthorized -> not found; pending applicable job/variation -> test payment controls; already processed/refunded/stale-stage states. No real charge. |
| `/receipts/[jobId]` | Owning customer or admin | Missing/unauthorized -> not found; payment/refund records, empty records and totals; refund timestamp explicitly unavailable. |
| `/messages` | Authenticated | Customer/assigned-tradie job conversations; admin jobs with messages; empty list, long job labels, status and latest message. Conversation entry goes to job. |
| `/tradies/[id]` | Public | Valid TRADIE profile, verification, trade/region, reviews or empty reviews; missing/non-tradie -> not found. |
| `/admin` | Admin via layout | Price jobs, price variations, cancellation reviews, customer sign-off, pending payment, claimable and assigned queues; empty/populated counts, loading/error. |
| `/admin/tradies` | Admin via layout | Registration checklist, verified/unverified, confirmation/back, updating; flag changes do not store evidence, expiry or review notes. |
| `/admin/payouts` | Admin via layout | Pending/paid records, empty export, CSV preparing/error/success, reconciliation confirmation/back/updating. Manual records, not money movement. |
| `/admin/settings` | Admin via layout | Controlled rates, input limits, valid/invalid hourly preview, save pending/error/success. |
| `/demo` | Explicit local-demo flag plus allowed local host | Role selection replaces current session; disabled/nonlocal -> not found. Active implementation should receive separate runtime/security review. |
| `/uploads/[file]` | No session check in current handler | Generated filename pattern only; valid existing image/PDF response or 404. Existing access-by-URL behavior needs privacy review for certificates/job evidence before production. |
| `/admin/payouts/export` | Admin checked in handler; otherwise 404 | Latest pending CSV, escaped cells/formula neutralization, empty dataset. UI handles download failure. |

## Job state matrix

| State | Customer | Tradie | Admin |
| --- | --- | --- | --- |
| REVIEW | Await estimates/price; cancellation | Verified other tradie submits/updates blind estimate | Inspect estimates, set fixed price |
| PRICED | Review fixed price; test payment; cancellation | Not an open claim/estimate stage | Re-price |
| BOOKABLE | Await claim; request cancellation review | Verified tradie reviews and claims; race failure retained | Monitor |
| ASSIGNED | Messages, approved-scope progress; cancellation review | Assigned tradie messages, requests photographed variation, uploads completion evidence | Monitor/support |
| SUBMITTED | Review CoC and confirm completion | Await sign-off/payroll | Review CoC and sign off |
| COMPLETED | Review tradie, payment record | Queued/paid payroll status | Reconcile payroll |
| CANCEL_REVIEW | Await admin investigation | Existing assignment context as applicable | Decide cancellation/refund path |
| CANCELLED | Cancellation status/records | Not open work | Records |

Variations separately expose requested, priced, approved and declined paths; approved scope contributes to existing totals. Payment records have pending, paid and refunded states. No new pricing, cancellation, tax or compliance policy is implied by this inventory.

## All-trades clarification: current mismatches and decisions

The user now wants **all trades**. Current code is not consistently electrical-only at the data layer, and replacing labels alone would be misleading:

1. `src/lib/constants.ts` defines Electrical, Plumbing, Gas Fitting and Construction. `actions/auth.ts` accepts these categories for a tradie's single `trade`; `actions/jobs.ts` accepts them as a job category. However `signup/SignupForm.tsx` offers only Electrical and `jobs/new/JobForm.tsx` submits a hidden Electrical category. Decide the supported taxonomy, multi-trade profiles and category selection before exposing broader options.
2. `actions/tradie.ts` gates estimates/claims on role plus a single `licenceVerified` boolean. It does **not** match the user's trade to the job category. A multi-trade launch needs explicit eligibility/category rules, including categories that do not use the same licence system. Do not imply all verified tradies can perform all work.
3. `admin/tradies/page.tsx` uses EWRB review wording. The schema has one registration number and verification flag, no per-trade credential classes, expiry, evidence or audit records. Generalize only after requirements are agreed; do not apply electrical registration to every profession.
4. `actions/tradie.ts` requires a CoC number and photo/PDF for completion; `prisma/schema.prisma` has a dedicated `Coc` relation. Sign-off and page-load auto-release depend on that workflow (`lib/jobs.ts`). Non-electrical evidence and completion criteria need a deliberate model/workflow decision.
5. `lib/pricing.ts`, settings and payroll currently use shared labour rates, holiday pay, on-costs, markup, GST, minimum hours and manual payroll. No per-trade rate schedule or alternative engagement model is represented. Preserve the current calculations until trade-specific pricing/employment/tax requirements are settled. This is a code constraint, not legal advice.
6. Electrical/electrician/CoC wording appears throughout landing/search, onboarding, job posting, detail, dashboard, messages, support, admin and payment pages. Change it alongside real capabilities; do not remove accurate warnings or test-payment labels indiscriminately.
7. The managed flow is still blind estimates -> admin fixed price -> test payment -> verified claim. Automatic market-derived pricing is a future decision, not an implemented capability.

## Static UI review and runtime checklist

Reviewed current diffs excluding homepage/demo edits against `ui-review-acceptance.md`. No confirmed new admin or form-state regression found by static inspection. This is not evidence of pixel, keyboard or browser correctness.

- Equal job-card geometry uses fixed content slots, clamped title/description/location and full detail links; missing-photo placeholders preserve image space. Check longest permitted gross amounts, saved-button wrapping and status text at 320, 341, 350 and 390 pixels, plus browser text enlargement. At <=340px the grid currently becomes one column.
- SourceAppFrame reserves 80px plus safe area below content; global scroll padding and control scroll margins reserve 96px. Check keyboard focus and programmatic confirmation focus near the pinned navigation, including summary elements, virtual keyboard and safe-area devices. Source-specific routes bypass this frame and require their own navigation check.
- Admin grids now respond to available content width rather than wide-window breakpoints. Check empty/populated queues, long unbroken identities/registration, open confirmation panels, export loading/error and settings validation/pending at narrow and desktop-window sizes.
- Job forms retain explicit dispatch/disabled fieldsets and stored input behavior. Check nested variation forms, two-column field labels at 351–390px, long amounts, message composer and scrolling message history, repeat submit/claim race, server errors and uploaded-file retention.
- Later layout pass should cover unchanged public/profile/support/recovery/notifications pages: some still use viewport `sm:` padding/grid rules inside a 390px frame. Review those before declaring a complete mobile-system pass.
- Exact original bottom glyph substitution remains unresolved per acceptance checklist. Existing independent icons are not evidence of exact source reproduction.

No runtime/browser checks or new test commands were performed for this read-only review/document task. Root integration owns runtime QA and acceptance sign-off.


## Mobile all-trades update (2026-10-21)

This update supersedes the electrical-only input observations above; the state table describes the configured electrical workflow. All four existing categories (Electrical, Plumbing, Gas Fitting, Construction) are selectable and searchable. Non-electrical jobs can be posted, reviewed and discussed, but estimating/claiming/verification/completion are visibly unavailable until trade-specific requirements are configured. Existing data and schema are preserved; no user is automatically qualified. The server requires a matching category for estimates/claims and prevents an electrical CoC from completing another trade. Existing non-electrical verified flags are not treated as eligibility; an administrator can remove them.

Additional review targets: each signup trade's registration requiredness; draft category restoration; matching/mismatched tradie and job; legacy non-electrical verified flag; pending compliance notice on job, profile and admin; no electrical certificate form on non-electrical assignment; no automatic release for unsupported trades. Payment controls remain test-only. Wider desktop design is deferred; narrow frames must still avoid collapsed columns and horizontal overflow.
