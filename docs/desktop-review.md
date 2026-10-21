# Desktop layout review

Rollback/mobile checkpoint: 93f1ce28e689ab7412d0315bc9fa200134ba5fdb, published to PR #2. Desktop work is separate on feature/desktop-layout-review-20261021.

Scope: browse, all-jobs, job-detail and their desktop navigation only. At 1024px and wider, use a labelled top navigation with existing original glyphs and wordmark, wider browse rails, a three/four-column job board and a main/action-column job detail. Long action panels scroll with the document. Existing fonts, colors, shadows and component shapes are retained. These are desktop adaptations for review, not original Figma desktop screens.

Mobile CSS rules are unchanged; all layout overrides start at 1024px. The 390x844 homepage capture matches the approved mobile screenshot byte-for-byte. Browser checks cover 390/1024/1440 for all three pages without horizontal overflow. Build, lint, TypeScript and all 39 existing tests pass. Desktop artwork and form/gallery interactions need independent review before wider rollout; no backend behavior changes were made.

Some copied QA database photo URLs have no corresponding upload in the isolated build. Representative detail screenshots use an existing illustrative demo-image job. This is a fixture limitation; no replacement user photos or claims of real completed jobs are introduced. Gas Fitting has no recovered category illustration yet. Other routes remain mobile-first and are intentionally outside this first desktop proposal.

Review evidence: task/evidence/desktop-review. Stable approved mobile demo stays on port 3010; separate desktop review on port 3011. Both use absolute isolated database paths. No production deployment or shared-branch merge.

Additional browser checks: gallery opens, Right Arrow advances to photo 2, Escape closes and returns focus to its opener. Focused payment navigation remains below the sticky desktop header. The original light wordmark uses an unchanged vector on a forest backing for contrast.
