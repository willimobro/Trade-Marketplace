# Account and customer presentation follow-up

Base: f23936b. Work is isolated on `feature/ui-completion-20261022`; the deployed hosted-preview branch stays unchanged pending independent review. This is a bounded frontend improvement, not full product completion. No new visual tokens or trade-orange mode were introduced while the newly supplied brand guideline review is pending.

## Added or improved

| Area | Concrete delta |
| --- | --- |
| Signup details | Two-step progress, retained identity summary, descriptive role choices, associated trade guidance, focused server errors and readable responsive spacing. Original first-step artwork/geometry unchanged. |
| Account editor | Selected-photo preview/fallback/clear control, exact existing 5 MiB limit, retained selection after failed save, cleared temporary selection after successful save, focused result, existing field limits, bio counter and registration-change consequence. No saved-avatar deletion capability invented. |
| Public tradie | Saved completed-job/review/rating summary, no-bio/no-rating states, long-content wrapping, joined date, pending trade requirements, scoped loading and unavailable screens. No fabricated ratings or qualifications. |
| Checkout | Saved job/variation scope and note, original versus extra-work amount, explicit test action, paid/refunded/stale copy, loading/unavailable states. Pending non-electrical categories do not promise claiming is enabled. |
| Payment record | Saved totals first, net recorded payments distinguished from amount owing, per-entry disclosure, eligible pending-checkout link, loading/error/unavailable recovery. Existing record filtering and cents calculations unchanged. |
| Cancellation and quote | Original quote distinguished from variations, test-labelled extra-work review, clear immediate versus review cancellation consequences, associated reason guidance, narrow wrapping and retained focus behavior. |
| Coverage docs | Marked obsolete early icon/desktop/electrical-only observations as superseded, preserving inspection history. |

## Verified locally

- 53 application tests and 8 preview-security tests pass; full lint, nonincremental TypeScript and protected production build pass.
- Fresh disposable SQLite fixtures on local port 3133; no shared or hosted database was used. Local test server stopped after browser checks.
- Signup at 390px: selected role, Electrical required registration versus Plumbing optional registration, Back retains identity fields, heading/input focus restored.
- Profile save succeeds with result focus. Public tradie populated review/statistics view inspected at mobile and desktop sizes.
- Checkout, saved receipt, account and public tradie: 20 viewport checks across 320/390/768/1024/1440, no horizontal document overflow. Representative screenshots in `task/evidence/account-payment-batch`.
- Customer opens unpaid cancellation review, dismisses to the opener, reviews original scope, follows empty receipt to pending checkout, records one test payment, and sees the saved receipt. Paid cancellation review explicitly says review is required and no real money moves.
- Missing checkout and receipt render their own unavailable recovery screens; loading announcements observed.

## Still requires independent QA

- Avatar chooser timed out in the browser tool before a file was selected. Preview/clear, oversize rejection, server-error retention and post-upload success clearing are implemented but not runtime-certified in this pass.
- Signup repeated server errors, profile no-bio/no-review/pending-trade cases, long-content extremes and all role combinations.
- Refunded/stale/variation checkout and combined receipts; receipt error/retry. Existing eligibility/security tests pass, but these exact presentation states were not all exercised in this pass.
- Expanded keyboard/zoom/screen-reader review and all earlier-step editing combinations.

## Remaining product areas

Admin verification/payroll/settings, tradie earnings and assignment variations, offline/message/gallery recovery, and broader account/history interaction coverage still need systematic product review. Real email, payments, qualification verification and other external services remain unwired; the protected sample journey demonstrates intended flows without relaxing production guards. Newly supplied brand guidelines need reconciliation with Matthew's direct all-trades and visual directions before any palette/type/layout-token changes.
