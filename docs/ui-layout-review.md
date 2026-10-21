# Layout review after Matthew's feedback

This is a working frontend review, not a claim that every backend integration or every possible state is complete. Figma frames describe moments in a functioning app. The homepage is now semantic HTML with native overflow and controls, not a flattened screen-sized SVG. SVG remains appropriate for artwork and the preserved wordmark.

## Verified in this batch

- Customer, tradie and administrator entry via explicitly enabled local `/demo`, through normal authentication.
- 112 combined role/public-route viewport checks at 320, 390, 768 and 1440px: no document horizontal overflow. Coverage includes homepage/search, login, signup, recovery, for-tradies, demo access, payment, receipt and public tradie profile.
- Homepage image assets load; horizontal rails respond to arrow keys and dispatched touch swipes; vertical page scrolling keeps navigation pinned. Dialog opens/closes with Escape and restores focus to its trigger.
- Profile phone field is fully visible above pinned navigation when focused.
- All four visible discovery cards measure 187×608px at390. Saved control updates its pressed state. Original photo geometry is retained; title/location/description slots align and route to complete details.
- Admin verification review opens with focused review text. Settings and payroll review layouts inspected. No actual verification/payment/settings mutation was performed in this visual pass.
- Build, ESLint/TypeScript and17 automated tests pass. Existing calculations/authentication are unchanged.

## Recommendations for Matthew, not silently applied redesigns

1. **Connect homepage content to real discovery/history.** The original sample cards remain explicitly labelled examples. Suggested and recent rails now scroll and link to the working board, but they are not personalized recommendations or real recently viewed records. Reuse the board's existing user-scoped history when defining the all-trades discovery experience.
2. **Reduce discovery preamble density.** The All Jobs search/filter/help content occupies much of the first mobile viewport. Consider collapsible advanced filters and shorter inline guidance so the first job row appears sooner. Retain essential status and pay distinctions.
3. **Approve a responsive desktop composition.** The approved mobile visual system currently remains a centred390px frame on wide displays. A wider list/detail layout would use desktop space better, but no original desktop authority exists; request design review before implementing it.
4. **Resolve accessible colour and icon choices.** Some original white-on-leaf CTAs remain below AA contrast. Exact SF glyph redistribution lacks verified permission. Approve a licensed icon family and an accessible CTA treatment as deliberate exceptions; do not claim exact/AA while unresolved.
5. **Unify bottom navigation across route transitions.** Home and generic workspace routes have pinned navigation; dedicated source job/detail/auth routes preserve their existing back/navigation patterns. Review which task flows should retain global navigation before adding it everywhere.
6. **All-trades onboarding and evidence must be designed together.** Category selection, eligible tradies, credentials and completion evidence differ by trade. Do not rename electrician/CoC controls into generic requirements without changing the underlying rules. See route-role-state-inventory.md for the concrete constraints.
7. **Review remaining form density on large text and real devices.** Automated width checks do not establish screen-reader usability, real iOS keyboard behavior or all text-enlargement cases. Auth remains positioned to match the reference; stress-test long errors and browser zoom before broader rollout.

Account jobs-taken/history expansion remains deferred at Matthew's request. The independent QA handoff should use `route-role-state-inventory.md` and re-test every listed state with isolated fixtures, especially claim races, cancellation, payment retry and CoC failures. This batch does not certify those states anew merely because prior checkpoints passed.
