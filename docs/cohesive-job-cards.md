# Cohesive cards, galleries and quote conversations

This increment follows the approved Available Jobs dashboard card reference and
the 32-page **Trade Marketplace Brand Guidelines.pdf** in the repository. It
preserves the public landing page, Forest shell, approved Roboto Flex, customer
Leaf/Lime and trade Hi-Vis/Amber. Existing original icon assets remain unchanged.

## Delivered surfaces

| Surface | Change |
| --- | --- |
| Customer dashboard | Shared square-photo cards with reserved title, status, ETA/price and action slots. View, message, review and receipt actions are outlined; Accept price stays solid. |
| Tradie Quote feed, Available jobs, Quoted Jobs, My claims | The same card geometry; title/photo opens a full sample detail route. Feed position and filters survive the detail return. |
| `/quote-jobs/[id]` | Three illustrative photos, scope/access/timing information, customer context, discussion, valid quote submission, existing five-point claim and completion. Desktop shell and pinned mobile navigation work. |
| Quotes across sample surfaces | Orange Quoted belongs to this viewing account. Green Accepted requires an explicit acceptance of this account's saved quote. Acceptance adds no points and locks that quote; it is not a claim. |
| Completed jobs | Darkened photograph and COMPLETE override other photo treatments. Stable active-first grouping preserves date ordering within groups; completed-only filters remain available. No completed jobs are added to open feeds. |
| Points | Accessible information dialog beside the balance replaces the permanent explainer. A valid first quote earns one point; edits/opening/acceptance do not. Claims remain five points, atomic and idempotent. |
| Messages | Persistent read/unread controls, visible badge/dot/weight difference, price or pending-price text, per-account quote status and completed treatment. Sample conversations open directly at their discussion. |

Card photos are square at every size. Card bodies reserve 300 px, with a two-line
title and a 55 px action row. At 390 px the card is 358 × 658 px; at the 1440 px
desktop reference each two-column card is 588 × 888 px. The same insets apply to
customer and tradie dashboard cards, including intermediate tablet widths.
Photo arrows and dots are separate controls from the detail link. Arrow keys,
touch gestures and previous/next buttons change the photo without navigation.

## Data boundaries

The new detail/discussion/acceptance flows operate only for reserved sample
tradies in an explicitly allowed local or protected hosted runtime. They do not
modify real customer jobs, send comments to a customer, change real prices,
create bookings, or move money. New comments and acceptances use the same
account-scoped atomic IndexedDB ledger as demo quotes/claims. Schema v2 migrates
v1 data and prevents an older tab from silently dropping the new fields. An old
deployed tab must reload to read a v2 ledger. Photos are existing attributed local
fixtures; see `docs/demo-assets.md`.

Customer cards continue to open their existing authorized job, payment and
receipt routes. Existing database-backed job boards remain distinct from the
browser-only quote simulation. Sample acceptance is an explicit detail-page
preview control, not an inferred global winner. Real quote adjudication and
cross-device synchronization remain future backend work.

## Validation and QA acceptance

- Unit coverage includes first-quote rewards, duplicate/edit behavior, atomic
  ledger operations, insufficient balances, per-account acceptance, comment
  validation/idempotency, v1 migration, active-first ascending/descending order,
  read/unread persistence and safe return navigation.
- Browser review covers 320/390/768/1440 px, equal card bounds, no horizontal
  overflow, outline/solid action styles, carousel non-navigation, valid quoting,
  claiming/completing/reload, completed-only filter, conversation anchor/focus,
  comment-save focus and quote Cancel focus.
- `tests/browser/quote-feed-skip.cua.js` and
  `tests/browser/quote-detail-focus.cua.js` are reusable CUA regressions. Run only
  with browser ownership and isolated synthetic fixtures.
- Runtime checks and screenshots are stored outside the repository under the
  task's `evidence/card-system` folder. Independent QA receives the exact commit
  before any protected preview deployment.

## Requested follow-on: same-person Account mode

The actual PDF page 15 shows **Profile → Account mode**, one white capsule with
Customer left and Trade right, the active inner pill green/orange. Page 24's
Forest text rule takes precedence over white labels in the p15 illustration.
Pages 13, 16 and 27 retain the shared shell and semantic theme tokens.

This control is intentionally a separate next increment, as agreed in the task.
The existing demo picker replaces sample sessions and is not that feature. The
follow-on must retain one signed-in identity and immutable server permissions,
use separate synthetic hiring/working state, preserve unsent quote/comment/job
drafts, and switch presentation/navigation without granting backend privileges.
No guest overlay, new login wall, schema role expansion or gate change is part
of this release.
