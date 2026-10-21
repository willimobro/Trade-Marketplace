# Approved orange trade mode

Separate branch based on QA-cleared a9cd22d. Matthew approved orange trade accents; this supersedes the pending-orange notes in earlier audit documents. No hosted-preview change is made by this checkpoint.

## Implementation

- A route-aware `BrandMode` application root chooses trade mode for any signed-in TRADIE, independent of trade category. Customers, guests and administrators use customer mode.
- Shared login/signup/recovery, profile/account settings, admin, support/notifications, role-picker and sample-journey controls retain customer colours. Posting is also customer-coloured. Client navigation changes the wrapper's mode directly, rather than leaving a role-only HTML attribute stale.
- Trade action #FF8200, signature #ECA154, link #9E4A00. Customer action #6CBD45, signature #A6D754, link #326C20. Both keep Forest labels and Forest shell/navigation. Raw original Leaf/Lime asset tokens remain intact.
- Existing utility colour names resolve as compatibility aliases at the mode root. Shared primary/secondary actions, selected desktop navigation, messages and action accents inherit the mode. Dashboard actions, discovery borders, job prices and saved-job controls now use semantic tokens instead of hardcoded green.
- Hover tokens retain the appropriate hue. Saved-job hover preserves the selected signature state. Disabled controls retain disabled semantics and reduced opacity; colour does not enable any unavailable operation. Visible focus and existing keyboard clearance are unchanged. Original icon silhouettes/artwork are retained.

## Verification

Route tests cover trade work surfaces, shared exceptions, customer/admin/guest defaults and path segment boundaries. No category condition is used, so orange is not limited to electricians.

Computed browser checks on the production build: tradie dashboard action rgb(255,130,0), signature #ECA154, link #9E4A00 and Forest header rgb(12,37,29); client navigation to Account changes mode to customer with Leaf save button rgb(108,189,69). Discovery tested at 320/390/768/1024/1440 without horizontal document overflow. Browser inspection caught and corrected a selected-save hover override during implementation.

Contrast from WCAG relative luminance: Forest on Hi-Vis 6.51:1; Forest on Amber 7.54:1; trade link on White 6.12:1 and Cream 5.20:1. These are individual text-pair checks, not full accessibility certification. Disabled controls require separate visual/usability review, not an active-text contrast claim.

Evidence: task/evidence/orange-mode. Independent theme review should include route switching, all tradie categories, mobile pinned navigation, shared auth/admin exceptions, selected/hover/focus/disabled states, and ordinary customer regression. No account qualification, pricing, payment, database schema or authentication behavior changed.

Final checks: 56 application tests, 8 preview-security tests, full lint and protected production build including TypeScript pass. Final production-build browser check confirms selected saved-job hover rgb(241,180,114), retaining Amber hue rather than reverting to Cream. Local disposable server stopped after verification. No unreviewed changes deployed.

## Detail-action QA correction

The focused review found three raw Leaf/Lime overrides in `jobs/[id]/detail.module.css`. They now use semantic action/signature tokens, including matching hover states. This preserves the existing customer Leaf/Lime distinction while giving tradies Hi-Vis estimate submission and Amber signature-style shortcut/message/completion controls. Disabled detail controls retain the existing neutral disabled treatment.

Targeted browser computed-style regression at both 390 and 1440 pixels:
- Tradie estimate shortcut: rgb(236,161,84); estimate submission: rgb(255,130,0).
- Tradie message Send and completion: rgb(236,161,84).
- Customer message Send: rgb(166,215,84), unchanged green.
- All measured labels: Forest rgb(12,37,29).

Evidence: `task/evidence/orange-detail-fix/computed-styles.json`. Completion was revealed by declining an open variation only in a fresh disposable SQLite fixture; no shared or hosted data changed. CSS audit found remaining raw greens only in intentional shared customer surfaces, default palette declarations and customer posting. JSX audit also found the deliberate green verified-status badge, which is a status indicator rather than a mode action, and preserved auth/sample artwork. Local QA server stopped after checks.
