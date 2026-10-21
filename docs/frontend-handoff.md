# Responsive frontend handoff

## Scope and sources

Frontend-first refresh of existing customer, electrician and administrator journeys. Server actions, database schema and pricing calculations are unchanged. No deployment, real payments or native-app changes.

Original design: https://www.figma.com/design/WurSo76mY67lO23D4Zlu7v/Trade-Marketplace-1
New design workspace (separate Figma worker): https://www.figma.com/design/sC8nFNkf2Glt2rcjeuSkID
Recovered archive: design/recovered-2022-assets branch, design/legacy-2022. Original artwork is copied unchanged into public/brand. BUSINESS_PLAN.md defines the current manually priced prototype; automated pricing and estimate credits remain future concepts. New Figma screens are still in progress; exact visual parity is not asserted.

## Shared design contract

Forest #0C251D, leaf #6CBD45, lime #A6D754, warm #F1ECE5, white surfaces. Poppins, 48px primary controls, visible keyboard focus, reduced motion, original lightning mark and van/account artwork. Forest text on lime primary actions. Responsive role navigation, labelled controls, status/error announcements and native keyboard controls.

## Implemented journeys

- Public landing and electrician explanation; login, role signup (Electrical only) and account editing.
- Customer dashboard, job posting with photo validation and review-before-submit, fixed-price detail, explicit test checkout, variations, completion and review controls.
- Electrician work dashboard and regional estimate/claim board, blind estimate forms, claim/error states, job conversations, variation and CoC forms.
- Administrator pricing queues, manual verification review, payout review/CSV, settings with preserved input and confirmation controls.
- Role-scoped messages inbox, responsive shell and navigation, loading/error/not-found/empty states, expandable native photo galleries.
- Saved fixed-price total is authoritative. A recalculated breakdown is withheld if it differs from the stored total. Refunds are labelled demo records with no money moved. Completion cards disclose actual configured page-load auto-release consequences.

## Reproducible local setup

Validated on Node 22.22.0, npm 10.9.4. Use .nvmrc and npm ci. The minimal lock repair adds missing @emnapi/core and @emnapi/runtime 1.11.3 entries; existing dependency selections are unchanged. db:seed explicitly loads .env and is only for a disposable database. No credentials or local database are committed.

## Verification and remaining coverage

Lint, TypeScript and 11 pricing regression tests passed during integration; production build passed after final QA refinements.

Browser observations: original landing artwork renders, failed login shows an error and retains input, customer login/dashboard works at 390px, messages inbox is role-scoped, electrician login and estimate/claim board render; final admin login and mobile queues render. Mobile navigation was changed to a fitting grid after visual inspection. The photo chooser failed in browser automation, so upload/review/repeated submission remains unverified. Final mobile/desktop visual coverage, keyboard flow coverage, claim-race interaction and exact finished-Figma comparison remain review gates. Do not infer these passed from unit tests.

## Deferred work / existing limitations

No automatic pricing, credits, scheduling, saved jobs/search, password recovery, real payments, real refunds or payroll integration was added. These need separate product decisions and backend work. Preserve future screens as explicitly labelled prototypes when designed, not fake successes.

Existing backend limitations include public-by-URL uploads, holiday/minimum settings not fully snapshotted, page-load-triggered overdue completion, and transaction/race concerns around payout completion and payment/pricing changes. npm ci reports 10 existing vulnerabilities (9 high, 1 moderate); dependency overhaul is outside this frontend change. This is a development preview, not launch readiness.

Integration owner: this feature branch. Public/account, job journeys and admin writers used bounded file scopes; QA owns tests only. Shared web-app/main and original design were not edited.
