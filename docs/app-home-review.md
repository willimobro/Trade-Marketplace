# App Home candidate handoff

Branch: `feature/in-app-home-20261023`, based on verified live `f668a37`. The protected hosted branch and Render settings are unchanged. No deployment is authorized until independent QA GO.

## Routes and source comparison

- Signed-in `/`: current-mode app Home. Guest `/`: preserved marketing landing.
- `/website`: preserved marketing for both guests and signed-in users; its own fragments stay under `/website`, and Open app/Return to Customer or Trade home returns to `/` without changing identity or mode.
- `/dashboard`: Your jobs. Trade prototype Find work remains `/dashboard?quoteView=feed`; native anchors and category/reset navigation remain in place. Admin root resolves to `/admin`.
- Customer Home source is the actual sixth PDF page, printed **06**, index **5**, “The First Five Seconds”. Source render: `/Users/mattmacbook/Documents/Codex/2026-10-21/task/evidence/app-home-source/brand-page-6.png`. Adjacent pages 05 and 07 were inspected to confirm numbering.
- Preserved source hierarchy: Forest hero, white display headline, request/location bar and Lime action, outlined chips, original upright bolt and green van/tradie art, three numbered steps and orange trade door. No active-jobs Customer dashboard was substituted. Mobile is a responsive adaptation of that desktop concept.
- Necessary adaptations: signed-in app navigation replaces Log in; all-trades chip/copy options replace electrical-only promises; no invented five-star reviews, licensing or certificate guarantees. Get a price opens the existing posting form and does not manufacture an instant price.

## Implemented behavior

- Home request merges only intentionally edited title/suburb/category into the existing account-specific draft. It retains description/address/region, timing, photo names and accepted/posted local records. A new review is required. Storage failure retains Home inputs and stops navigation. Existing file reattachment guidance remains in the posting forms.
- Trade Home reads owned assignments and saved pending gross payroll totals only. Local points/claims come from the existing isolated ledger, with account isolation and refresh events. An accepted quote is not counted as a claimed job. No new accounting, payments, privileges or service integrations.
- Shared controls/cards have opt-in short transform/opacity feedback. No page or timed route animations. Fine-pointer-only hover and explicit reduced-motion overrides preserve touch/keyboard use.

## Verification performed

- Production `preview:build`, full lint, TypeScript, **141 app tests** and **8 preview-security tests** pass. New regressions cover draft preservation/latest-account merge, owned summary queries and saved payroll totals, and revised Home/Website routing.
- Actual browser checks: Customer and Tradie identities, both presentation modes; Home/logo; separate Website and mode-aware return; Your jobs → Find work at 390/1440; Plumbing filter; reload and native Back/Forward restoring filtered feed; Home posting handoff; existing detailed scope preservation; actual Tradie Customer-mode local posting; unsent quote and comment preserved through Home/Back with points unchanged at 3; native required-field validation and keyboard focus.
- Home viewport checks at **320, 390, 768, 1440px**, Customer and Trade: no horizontal overflow. Mobile bottom nav remained pinned. Computed CTA Forest on Lime and 140ms feedback verified.
- One historical React hydration warning was captured during the multi-build session; a fresh Home navigation plus full reload after the final rebuild did not reproduce it. Browser-extension asynchronous-listener messages also appeared. QA should check fresh-load console behavior independently; no assertion of a cause is made.
- Reduced-motion rules are implemented, but root did not emulate the preference with its advertised browser controls. Independent QA must verify the computed reduced-motion state rather than treating the CSS declaration as a runtime pass.

Evidence folder: `/Users/mattmacbook/Documents/Codex/2026-10-21/task/evidence/app-home-review/`.
Screenshots: `customer-1440.png`, `customer-390.png`, `trade-390.png`, `actual-tradie-1440.png`, `customer-keyboard-focus.png`. Measurements and manual interaction record: `responsive.json`, `interaction-checks.json`. Only synthetic demonstration data appears.

## Independent QA acceptance

Compare the actual source image against Customer Home; inspect both identities/modes at mobile/desktop. Verify Website fragments and Back/Forward, Home/logo/search separation, filtering, quote/comment/post drafts, no duplicate rewards, keyboard/focus/touch, reduced motion, gallery behavior after card feedback, no overflow, and unchanged outer preview gate. Leave the live deployment at `f668a37` until cleared.

Remaining limits: desktop reference is a PDF concept, not a pixel specification for every viewport; backend integrations remain unchanged; uploaded files cannot be recreated from saved names after leaving a browser editor. This candidate is a bounded Home/navigation/motion release, not full frontend completion.
