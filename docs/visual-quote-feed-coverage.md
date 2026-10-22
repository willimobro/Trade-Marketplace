# Visual quote feed and simpler customer journeys

Branch: `feature/visual-quote-feed-20261022`, based on the live `95415b2` checkpoint. This batch preserves the approved brand and changes information hierarchy, not the visual identity. Live hosting remains unchanged pending independent review.

## Implementation boundaries

- Customer dashboard shows photo/title, short stage, saved price or explicitly illustrative quote ETA, and one next action. Photo/title open the full job. Accept price opens the existing review flow; it never confirms a payment itself.
- Messages use circular job photos and browser-local unread receipts, scoped per user and latest message. Opening visible conversations or marking a row read updates this browser only; cross-device delivery/read synchronization remains future integration.
- Posting preserves fields, draft recovery, validation and final review while reducing explanatory copy.
- Reserved sample tradies in an explicitly enabled loopback demo or authenticated hosted-preview runtime receive the quote workspace. Ordinary accounts and production defaults retain the existing workspace.
- Quote/claim state is a versioned, validated IndexedDB record per sample user. Read/write transactions serialize modifications across tabs. A first valid quote earns one point; editing the same quote earns none. A claim spends five once, with insufficient-balance rejection. The initial three points are illustrative starting credit. This is not currency, real job booking, or a production eligibility mechanism.
- Browser data can be reset by its owner and is not a tamper-proof reward ledger. Server-authoritative accounting, trade eligibility and marketplace synchronization are deferred. No production actions, authentication, payment services or licensing requirements are relaxed.
- Added sample records and photographs belong only to disposable seed fixtures; never run the destructive seed against existing user data. Stock photos are illustrative, not evidence of real jobs. See the asset attribution manifest.

## Review focus

Check 320/390/768/1440px layouts; long titles; touch and keyboard alternatives to swipe; modal names and focus return; validation and storage errors; repeated quote edits; repeated claims; reload and cross-tab consistency; role isolation; read/unread transitions; and detail navigation. Confirm the primary action answers what to do next without competing explainers.

## Deferred and evidence

The supplied screenshot Library ID `libfile_0822589207c881919ef8fc90e4c0943f` could not be materialized with currently available Library tools, so this batch follows the explicit written direction and approved repository brand guide; it does not claim pixel comparison to that screenshot. Runtime screenshots and actual check outcomes will be recorded before handoff.

## Completed verification

- Production preview build (includes TypeScript validation), ESLint, 70 application tests and 8 preview-security tests passed.
- Browser checked customer dashboard/messages/posting and four tradie views at 320,390,768,1440px: 28 measured combinations, no horizontal overflow or broken loaded images.
- Customer status filter preserved three next-action jobs, including recent SUBMITTED completion review. Accept price opened the existing test-payment review without recording payment.
- Keyboard Mark read retained focus on its conversation; opening a conversation focused/scrolled to its thread and returned with read state preserved.
- Browser points journey: starter3 → firstquote4 → secondquote5 → edit5 → claim0 → completion0 → reload0.
- Two-tab same-job quote submissions awarded one total point; same-job claim attempts produced one claim and one five-point spend. Claim success now explicitly focuses the dialog heading, and a broadcast claim resolves an already-open review to the existing success state.
- Dashboard pinned navigation restored with existing source silhouettes and safe-area/focus clearance. Quoted Jobs uses square photos and a gradient Quoted/coin badge. Responsive evidence lives in the task's `evidence/visual-quote-feed` directory (not production assets).

## Remaining limitations

- Independent QA has not signed off this batch yet. It is not deployed.
- Points and demo claims are per browser/sample account; they are separate from database-backed existing job activity and are not shared between users/devices. The existing activity is kept behind a disclosure. Production points accounting and eligibility must be designed later.
- Twelve photo assets serve 26 database fixtures and 12 quote-workspace examples; repeated images still exist where subjects fit. Twenty added jobs use only fictional addresses/accounts; other-trade database jobs preserve pending-service guards, while the quote workspace demonstrates all four trades without invoking those backend actions.
- Storage unavailable/corrupt states have recovery UI and model validation; manual browser corruption/storage-denial injection was not performed.

## Skip focus correction after independent QA

Independent review of `ee99678` passed the financial-simulation invariants, storage/account isolation, customer actions, messages and responsive checks, but found that Skip removed the focused button and left keyboard focus on the body. The correction schedules focus after the replacement render: next job heading, final empty-state heading, and restored first heading after Show skipped jobs. Other feed controls and dialog focus behavior stay unchanged.

`tests/browser/quote-feed-skip.cua.js` adds an executable CUA regression for repeated Skip, the final empty state, restoration, Next and dialog Escape at 390/1440px. Its syntax and lint pass; execution is pending browser ownership handoff from the landing task. Build/TypeScript,70 application tests and8 security tests pass after the fix. No claim of browser signoff is made for this correction yet.
