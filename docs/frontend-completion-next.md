# Frontend completion batch

The stable integration checkpoint a505872 is separate from this branch. It combines the customer feed access fix, desktop expansion, protected role picker and sample distances. Do not modify its test runtime while independent QA checks it.

## Current implementation ownership

- Recovery: interactive request, validation, pending, resend, expired link, reset and completion; local simulation, no email or credential mutation.
- Support: topic discovery, answers, validated request, pending/error/retry and confirmation; no outbound delivery.
- All-trades journey: protected synthetic customer/tradie/admin workflow with local state. The normal job actions and trade eligibility checks remain unchanged.
- Notifications and integration: read/unread filtering, mark all, empty/loading/retry, shared responsive shell, preview entry and combined validation.

All routes retain the approved original-derived typography, green palette and existing component shapes. New layouts are adaptations. Payment actions remain explicitly simulated. Hypothetical compliance is never recorded as verified. Prototype data is separate from real job and account records.

## Acceptance before publication

Check each new route at 320, 390, 768, 1024 and 1440 pixels. Exercise full keyboard form paths, visible focus, validation, edit/back, preserved values, error/retry and success. Check source navigation clearance and no horizontal document overflow. Verify the synthetic journey returns unavailable outside the protected hosted server, and that the outer password gate still protects every preview route. Run app and preview-security tests, lint, TypeScript and production build. Capture representative screenshots and reconcile actual coverage against the existing route-role-state inventory.

## Remaining product review

This batch does not establish full product completion. Review account/profile, onboarding and worker public profile consistency; customer quote/payment/cancellation/receipt states; tradie assignment/variation/completion and earnings; admin review/verification/payroll/settings; galleries, message states and offline recovery. Extend simulations where a missing service prevents demonstrating the intended interaction, without inventing live business policy or weakening production guards. Document unavailable service wiring separately from user-facing UI.

## Implemented checkpoint and local verification

Recovery now has request validation, pending state, demo inbox, resend cooldown, invalid/expired links, editable reset/confirmation, show/hide and success; password rules match existing signup. Password values clear on leaving reset and are never persisted or sent. Support has topic filters, searchable FAQ, empty results, validated request, interruption/retry, summary and restart focus. Notifications have read/unread filters, mark all, empty/loading/error/retry and focus restoration.

The gated `/preview/journey` provides eight stages for each of Electrical, Plumbing, Gas Fitting and Construction. It includes review/edit, role handoffs, sample photos, private estimate, fixed-price review, test payment, claim review, workspace messages/timing, extra-work approval/decline, completion evidence, sign-off and star review. Per-trade state stays in memory. Earlier-step edits reset later commitments; editable draft amounts do not silently change an already committed sample price. Existing real job actions are unchanged.

Local verification: 53 application tests, 8 preview-security tests, lint, TypeScript and protected production build pass. Browser checked four new/reworked routes at 320/390/768/1024/1440 (20 combinations), with no horizontal document overflow after correcting recovery's tablet split to use container queries. Recovery complete/invalid/expired flows, support validation/search/interruption/retry/restart focus, notification filtering/retry/focus, all four eight-stage journeys, per-trade progress retention, variation approval/decline and failed-save retry passed. Representative mobile/tablet/desktop screenshots inspected in task/evidence/ui-completion. This is not an exhaustive accessibility or every-route signoff.

Protection check: anonymous `/preview/journey` returns 401 through the custom hosted gate. Ordinary `next start`, even with hosted mode and a forged assertion header, renders the Next not-found boundary without the journey form. Next streams that boundary with HTTP 200 after rendering starts; content access is still withheld. No credentials were rotated and no Render service was changed.

Remaining independent review: keyboard/gallery focus across all journey states; every earlier-step edit/reset and pricing combination; signed-in navigation context; full wider-screen review of receipts/profile/onboarding/admin; representative mobile and desktop visual review by Matthew. The implementation is ready for this next QA pass, not certified as a complete product.
