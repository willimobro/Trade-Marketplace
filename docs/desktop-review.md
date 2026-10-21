# Desktop layout review

Rollback/mobile checkpoint: 93f1ce28e689ab7412d0315bc9fa200134ba5fdb, published to PR #2. Desktop work is separate on feature/desktop-layout-review-20261021.

Scope: browse, all-jobs, job-detail and their desktop navigation only. At 1024px and wider, use a labelled top navigation with existing original glyphs and wordmark, wider browse rails, a three/four-column job board and a main/action-column job detail. Long action panels scroll with the document. Existing fonts, colors, shadows and component shapes are retained. These are desktop adaptations for review, not original Figma desktop screens.

Mobile CSS rules are unchanged; all layout overrides start at 1024px. The 390x844 homepage capture matches the approved mobile screenshot byte-for-byte. Browser checks cover 390/1024/1440 for all three pages without horizontal overflow. Build, lint, TypeScript and all 39 existing tests pass. Desktop artwork and form/gallery interactions need independent review before wider rollout; no backend behavior changes were made.

Some copied QA database photo URLs have no corresponding upload in the isolated build. Representative detail screenshots use an existing illustrative demo-image job. This is a fixture limitation; no replacement user photos or claims of real completed jobs are introduced. Gas Fitting has no recovered category illustration yet. Other routes remain mobile-first and are intentionally outside this first desktop proposal.

Review evidence: task/evidence/desktop-review. Stable approved mobile demo stays on port 3010; separate desktop review on port 3011. Both use absolute isolated database paths. No production deployment or shared-branch merge.

Additional browser checks: gallery opens, Right Arrow advances to photo 2, Escape closes and returns focus to its opener. Focused payment navigation remains below the sticky desktop header. The original light wordmark uses an unchanged vector on a forest backing for contrast.

## Second desktop checkpoint (pending independent visual QA)

Explicit desktop navigation now continues through dashboard, posting, messages,
account and admin. Residual desktop workspaces use a bounded 1200px shell and
hide duplicate mobile navigation; support/auth/payment routes remain bounded.
A single global skip link targets a focusable main, and detail/action anchors
clear the sticky header. Admin subnavigation is mounted at desktop only.

Dashboard has compact forest header, two job columns and four statistics;
admin retains full-width decision records and bounded settings. Posting/account
are bounded at760px, messages at960px. These are desktop adaptations at1024px+,
not claimed original Figma desktop measurements. Mobile style declarations are
preserved. Pending trade discovery cards no longer promise estimate/claim actions.

41 tests, lint, TypeScript and production build are the code-check baseline.
Independent browser/resize/mobile-comparison QA is still required for this batch;
do not infer visual signoff from compilation. Hosted preview remains separately
pinned to33eaba3 and does not contain this pending desktop expansion.

### Conversation arrival correction

ConversationSection resolves #messages after streamed content mounts, focuses a
labelled programmatically focusable region, and scrolls it into view. It handles
hash changes and font settling without modifying history. At390/1024/1440,
headless browser checks passed keyboard link activation, direct URL, reload,
Back/Forward, in-page hash changes and gallery focus return. The heading remains
visible below the sticky header (near-bottom sections stop at document extent).
Evidence: task/evidence/conversation-fix/results.json and three screenshots.
41 tests, lint, TypeScript and isolated production build passed. Independent
confirmation remains required before integration into the hosted branch.

### Visual-first discovery and green navigation

User-directed follow-up: homepage now reads sanitized actual open listings rather
than repeated design examples. Homepage and job-board cards show photo, title,
pay (or Pay pending), and distance availability only. Existing gross-pay math is
unchanged. No coordinates exist in the current schema, so no kilometres are
invented. Saved jobs retain an accessible icon control. Real browser-scoped
recent jobs/searches replace fabricated history.

Desktop navigation is forest green with high-contrast white labels and lime focus.
Advanced filters are a native keyboard-accessible disclosure; search stays visible.
Pricing help is below the cards, preserving information without crowding discovery.

43 tests, lint, TypeScript and isolated production build passed. Ten browser
route/width checks across320/390/768/1024/1440 found no horizontal overflow;
keyboard saving, direct job links, recent history, horizontal scrolling, filter
empty/reset and disclosure keyboard operation passed. Evidence is in
task/evidence/visual-cards. These new visual choices await independent QA and
Matthew's review; the hosted service remains pinned to33eaba3.
