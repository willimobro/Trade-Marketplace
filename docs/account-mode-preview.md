# Customer and Trade mode preview

## Source and scope

The switch follows **Trade Marketplace Brand Guidelines.pdf**, page 15:
Profile → Account mode, Customer on the left and Trade on the right in a white
capsule. The active inset pill uses customer Leaf or trade Hi-Vis. Page 24's
Forest text contrast rule applies to both selected labels. Shared navigation
stays Forest; shared account/settings screens retain the customer palette.

This is a same-person frontend preview. Switching does not sign out, log in as a
different account, edit a database role, verify a trade, or grant server-action
permissions. The existing preview role picker remains a separate reviewer tool
that deliberately changes the sample account.

## Added behavior

- Profile has a keyboard-operable radio-group switch, current-mode status and a
  link to the selected workspace. Navigation shows the current mode and links
  back to the control on mobile and desktop.
- The selection is saved per signed-in account in browser local storage. Another
  tab cannot switch an open editor's mode. Storage failure is reported and the
  current visit can continue.
- Reserved sample customer accounts can explore the existing synthetic quote
  feed, quote details, points and conversations in Trade mode. No private backend
  job access is added.
- Reserved sample tradie accounts get a separate browser-local Customer
  workspace: varied jobs, photos, active/completed filters, details, price review
  and simulated acceptance, plus a post/review/save sample-job flow. Actual
  customer accounts keep their own existing authorized customer jobs.
- Mode-aware links keep simulated actions in their synthetic workspace. Opening
  a quote detail while in Customer mode offers an explicit switch and transfers
  keyboard focus to the resulting job heading.
- Quote and discussion drafts are saved per account/job in session storage for
  up to 24 hours. Cancel preserves them; explicit discard or a successful matching
  save removes them. Restoring a draft never awards a point.
- Synthetic customer text drafts persist per account. Photo files stay in
  memory for the visit and must be reattached after leaving the workspace;
  filenames and text are restored honestly. Nothing is uploaded by this flow.

## Boundaries and remaining work

The mode switch is enabled only for the exact reserved synthetic account/role
pairs when the existing protected-hosted-preview or loopback local-demo gate is
valid. Production defaults, arbitrary signed-up users, and administrators do not
get this control. `WorkspaceMode` must never be used as backend authorization.

Customer preview data and quote data are intentionally separate, replaceable
adapters. A newly posted local sample job is not distributed to other users.
Price acceptance is explicitly a sample state change, not a booking or payment.
Customer-mode conversations for a sample tradie are not yet a separate simulated
messaging workflow; navigation offers the customer jobs workspace. Real multi-role
accounts, onboarding, permissions and cross-device persistence remain future
backend work.

## Verification

114 app tests, eight preview-security tests, lint and the isolated production build
pass before browser review. New tests cover exact preview eligibility, account
preference isolation, safe navigation, draft expiry/corruption/write failures,
quote draft idempotency, sample posting/acceptance and preservation of newer
customer state when another tab saves a draft.

Browser acceptance must cover the PDF switch at mobile and desktop widths;
unchanged session identity; mode/reload navigation; quote, comment and posting
draft round trips; repeated Post entry; gallery interaction and modal focus;
sample price review; keyboard focus after switching; and narrow desktop header
layout. This document does not claim browser signoff or production readiness.
