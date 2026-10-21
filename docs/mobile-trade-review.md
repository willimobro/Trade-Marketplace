# Mobile trade-aware review — 2026-10-21

## Scope

Mobile-first implementation; wider desktop design remains deferred. Existing 390px visual language, original navigation outlines, approved Roboto Flex substitute, artwork, geometry and shadows remain. No migrations, shared branch merges, deployment or user database resets.

## Regression checkpoint 45c174a

- Source navigation paths now begin with a valid move command; all five have nonzero rendered bounds in Chromium. Raw glyph coordinates unchanged.
- Saved checkout rechecks ownership, pending status, parent job stage and variation stage in the payment transaction. A cancelled job cannot accept its stale variation payment or show a false paid confirmation.
- Job creation returns a saved identity; the form clears its draft only after persistence, navigates directly, and offers a saved-job link if navigation stalls. Repeated dispatch is prevented while pending.
- For-tradies/support remain single-column inside their mobile frame even on wide viewports.
- Browser reproduction: prior build remained on Submitting after 67.4 seconds despite a successful write; corrected build reached its job in 1.0 seconds. Each isolated database contained one created job and its one uploaded photo.
- Stale checkout browser test: open valid checkout, cancel its isolated parent, submit old form; payment remains PENDING, variation PRICED, parent CANCELLED. Reopening shows unavailable state and no payment action.

## Trade-aware mobile scope

- Signup, posting and browsing expose Electrical, Plumbing, Gas Fitting and Construction, the existing repository taxonomy. Additional trades/subcategories require a separate taxonomy decision.
- Electrical registration remains mandatory on signup. Other trades accept an optional registration number, show pending requirements, and never become verified automatically.
- Draft storage/review retains category; old Electrical-only drafts migrate to Electrical. Pending capability is explained before submission and on the saved job.
- Estimate and claim actions require matching trade/category and configured verification. Atomic claim includes category. An old non-electrical verified flag does not authorize work.
- EWRB verification and CoC forms are explicitly electrical-only. Non-electrical assignment shows completion requirements pending, with messages as the contact route. Automatic electrical sign-off does not apply to unsupported trades.
- Trade-aware badges and copy cover profiles, dashboard, job details, admin verification, public guidance and demo entry.
- Approved contrast changes are documented in brand-ui.md, retaining button fills/geometry/shadows and using forest labels.

## Verification and limitations

37 automated tests pass, including five action-level trade tests, four signup tests and four trade-readiness scenarios. TypeScript, ESLint and isolated production build pass. Runtime checks cover legacy verified plumbing-account profile/admin notices, absent electrical completion and unavailable variation controls, keyboard category scrolling with pinned navigation, all four signup selections, conditional registration requiredness, plumbing draft restore/review/save, and 48 width checks at 320/390/768/1440 across customer, tradie and admin. These include the existing customer job-board redirect to dashboard; they are not 48 distinct routes.

Evidence is under task/evidence/qa-regression-fixes and task/evidence/all-trades-mobile. Runtime fixtures use absolute-path isolated SQLite copies. During initial all-trades QA, a relative Prisma URL resolved to the feature checkout database and created one identifiable test job and photo record. A backup was preserved; only that exact fixture was removed, with its image retained. The affected checks were repeated after correcting the URL. No user-authored records were intentionally changed; the older demo processes were not replaced.

Independent review remains required before publication. This is not certification of every route/state or WCAG compliance. Non-electrical qualification/completion rules, production payment/recovery services, document privacy/access controls, and original Apple-derived icon redistribution permission remain unresolved. Native app and wider desktop redesign are later phases. Account history expansion remains deferred.

## Targeted follow-up after independent QA of 6829681

The lower customer Status card now uses the same category-aware `nextAction` helper as the upper next-step section, so pending trades do not promise private estimates. `requestVariation` applies the shared trade/category eligibility guard before upload validation or persistence. Regression coverage checks all three unsupported categories against a legacy assigned electrician and retains a successful electrical control case. Total automated coverage: 39 passing tests; lint, TypeScript and an isolated production build pass. Targeted browser evidence is in task/evidence/p2-consistency. This follow-up awaits independent recheck before publication.
