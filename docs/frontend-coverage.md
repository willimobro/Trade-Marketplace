# Frontend coverage and remaining boundaries

Original design authority: Figma WurSo76mY67lO23D4Zlu7v. The separate redesign draft is not the approved source. Reference layouts are centered at390px; wider screens preserve the mobile composition. Roboto Flex is the approved web-only font substitution. Generic SVG controls replace font-dependent icons. These are disclosed differences, not exact glyph parity.

| Journey | Available frontend | Boundary |
|---|---|---|
| Entry and account | Source browse/search, login errors, two-step signup, profile and avatar validation | Recovery is a clearly marked preview; no reset email service |
| Customer posting | Required scope/address/photos, review, edit with retained fields, submit/pending/error, account-scoped tab-local text draft recovery | Current business fields extend original mobile design |
| Discovery | Search/region/stage, saved and recent, empty/storage-error states, photo failure fallback | Saved/recent are browser-local, not server sync |
| Tradie estimating | Private estimate, current stage guidance and validation | Admin sets fixed price; no invented automatic pricing algorithm |
| Fixed price and claim | Customer review, simulated payment, available/claimed states, access checks | Test payments only; payment is not an appointment |
| Work | Messages, extra-work requests/pricing, photo gallery/zoom, completion upload | CoC validity/rejection/hold/replacement needs backend work |
| Outcomes | Cancellation/refund wording, receipt with variations, optional-comment review, payroll records | Recorded demo refunds/payouts do not move money |
| Administration | Review/pricing, registration review, settings, payroll/export | No original admin reference; layout is a documented adaptation |
| Help | Support guidance, notifications/preferences preview | No outbound support delivery or notification service |

Verification evidence is recorded in original-fidelity-status.md. The isolated database has six fictional jobs with labelled local demo photos and a conspicuously invalid sample certificate document. No source files, shared branches or live transactions are overwritten by these fixtures.

Remaining visual boundaries: original low-contrast green/white action pairs are preserved as requested and need an explicit accessibility/design decision. Below390px auth controls reflow without shrinking text; browse art becomes a cropped preview with readable search/navigation controls. The390px composition remains unchanged; no original desktop layout exists. Do not describe all screens as pixel-identical or production-ready.

## Coverage completion after59bd0d6

The accompanying frontend-coverage-matrix.csv audits all39 planned families against BUSINESS_PLAN.md and code. It separates core implemented flows, adapted/partial coverage, explicit previews and deferred policy. Recent additions close customer orientation/waiting guidance, admin unsent customer-price preview, saved earnings breakdown and browser-reported offline/reconnection feedback. No new service, payment, price or timing rule is implied.

Unconfirmed business-plan proposals remain deferred:5–10-sample auto-pricing/trimmed averages, credit accuracy/earning/starter/cap/first-pick rules, fixed-price menus, paid site visits, deposit/balance terms, booked-within-five-days/refund guarantees and direct assignment. Structured scheduling, price/verification history, after-completion complaints, correction/hold workflows and maintenance mode also need state or policy.

Browser QA of59bd0d6 runs independently; this follow-up has not taken browser ownership or modified its runtime/fixtures. Original390px source compositions and approved font exception are unchanged. New disclosures expand only when opened; the connection notice is absent during normal connectivity. Separate desktop designs still require review.
