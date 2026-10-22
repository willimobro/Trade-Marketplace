# Customer and tradie journey polish

Base: `571db3c23d346db204070e5762c9d0fefe80c0cd`. This is a bounded frontend follow-on to the Account mode release. Older coverage documents remain historical snapshots; they do not supersede the current orange trade mode, same-account presentation mode, or approved brand PDF.

## Delivered changes

| Gap | Correction |
| --- | --- |
| Customer job details lost their context when opening Messages | Outlined per-job message links carry a bounded local job ID and filter. The inbox and explicit return link restore that job. Unknown IDs receive focused recovery instead of selecting another job. |
| Accepting a sample price implied work had started | Newly accepted sample prices display **Price accepted**. The existing underway fixture remains distinct. No stored booking state or payment behavior changed. |
| Direct `/jobs/new` rejected an eligible sample tradie in Customer mode | Existing reserved-account/runtime eligibility hands the route to the browser-local composer. Trade mode offers explicit Customer mode entry. Actual backend posting authorization remains unchanged. |
| Invalid quote submission removed keyboard focus | Validate before disabling fields, associate errors with the affected field, and focus asynchronous save errors after rendering. |
| Mobile job-detail visual order differed from tab order | DOM and mobile order now agree: overview, quote/next steps, scope/discussion. Desktop retains its two-column grid. |
| A cross-tab acceptance left the quote editor open | Show a focused read-only accepted summary, retain unsent draft text, and preserve accepted price/scope and points. |
| Mobile chat appeared below every inbox row | Selected conversations have a focused mobile view; Back restores the list and its originating row focus. Desktop remains split. |

## Source and validation

The actual repository PDF was read/rendered using native PDFKit, including pages 15, 24, 26 and 27. Shared Forest navigation, customer green/trade orange, Roboto Flex, square fields and outlined navigation actions are preserved. Available Jobs and landing styling were not redesigned.

Integrator checks: 128 application tests, 8 preview-security tests, ESLint, TypeScript and isolated production build pass. Seven added unit regressions cover field validation, bounded context links, account-specific job lookup, acceptance labels and posting eligibility.

Observed UI checks on isolated synthetic fixtures: invalid scope focuses its textarea; a valid quote awards one point; cross-tab acceptance locks an open editor and focuses its heading while keeping 4 points; detail field order follows mobile presentation; all five customer cards measure 358 × 658 at a 390px viewport; accepted price and same-job Messages/back/browser-Back routes work; message draft survives navigation; missing job recovery is focused; direct Customer posting reaches the existing composer. Production mobile conversation and native desktop (1492px) screenshots were inspected. The responsive override did not change the existing tab from 390px, so 320/1440 checks are explicitly assigned to independent QA rather than claimed here.

## Review matrix

Use fresh isolated synthetic fixtures; do not use or reset user databases.

- Customer: filter → job → price review/accept → Messages → Back to this job → browser Back/Forward and reload, including locally posted jobs and unknown IDs. Keep filter and selected job, focus and unsent text.
- Customer direct posting: selected Customer/Trade modes for a reserved tradie; genuine customer and non-preview tradie permissions remain unchanged.
- Tradie: quote modal invalid amount/scope, valid save/edit/reload, storage error recovery and acceptance from a second tab while editing. No duplicate points, no accepted edits, no draft deletion.
- Job detail: mobile visual/tab order and desktop columns; discussion fragment/history regression; equal cards and outlined viewing actions.
- Widths: 320, 390, 768 and 1440 where relevant; no horizontal overflow or focused controls hidden by pinned navigation. Check mobile inbox close restores focus.

## Remaining product boundaries

This release does not make the full frontend complete. A systematic pass across admin/payroll, variations, completion/recovery and offline/error states remains separate work. Same-person role switching, new hiring jobs, sample messages and quote points remain isolated browser-local prototypes. Real delivery, cross-device persistence, payments, verification and backend multi-role authorization require later implementation. Account job history remains deferred. The authenticated live check still depends on Matthew's existing preview sign-in; no credentials or gate settings changed.
