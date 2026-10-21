# Original Figma fidelity work in progress

Authority: https://www.figma.com/design/WurSo76mY67lO23D4Zlu7v/Trade-Marketplace-1
The separate 42-screen redesign is not an approved visual reference.

## Source and method

Original archived `Trade Marketplace 1.fig` SHA-256: `d94d9a8189941ade8852ae17e4deadc1edd6d85a115699606a9fac26d2fb794f`.
The archive was decoded read-only (1,694 nodes). Original raster/vector artwork is exported under `public/original`; original files remain unchanged.
Login reference: node 7:8, 390×844. Layout, fills, button radius 11, inside secondary stroke 2, image transforms and text baselines come from source node data and were independently checked in the Figma inspector.
Live text remains accessible DOM/SVG text, not outlined font binaries or a screenshot background. Source glyph positions preserve the heading kerning. Installed SF Pro's named Expanded Bold instance is `wdth=132, opsz=28, wght=760`; merely asking Chrome for the local named face lost the width axis.

## Limits and publication gate

No SF Pro binaries are bundled. The user authorized a close free Google Fonts alternative for the web app. Roboto Flex is self-hosted with its OFL license; display text uses weight 900, width 151 and optical size 28, with normal-width body text. At 36px, the measured Welcome width is 194.656px against the source 194.484px. This is a deliberate authorized font substitution, not exact SF glyph equivalence. Font-dependent private-use icons are replaced with independently authored portable SVG controls at the existing source positions; these are compatibility adaptations, not extracted Apple glyph assets.

Original references cover mobile layouts. Centered source-width rendering on larger displays is deliberate; it is not an original desktop design. New business fields and current backend flows require clearly identified adaptations. The draft desktop sidebar and Poppins have been removed. Residual account/admin/support routes use a source-derived mobile shell; their content layouts are adaptations and are not original-reference matches.

Do not describe this branch or PR as an exact completed reproduction. Same-viewport source comparison and functional checks precede publication. Login initial screenshot comparison found and corrected a white label mismatch and the missing variable-font width axis. Native editable field baseline behavior still needs final comparison; browser/Figma anti-aliasing and the inspector's selection border are not source design geometry.

## Functional corrections retained

Clear claimed/unavailable recovery, readable message timestamps, saved cancellation outcomes, and focus return for cancellation and edit-details controls. Backend contracts and pricing behavior are unchanged.

## Source comparison evidence (local work session)

The recovered PDF pages 2, 3 and 6 have native 390×844 bounds and were rendered at that exact size. Login production vs PDF was inspected side by side; initial per-channel mean absolute pixel differences were 0.24% artwork, 0.22% heading, 0.54% buttons, 2.10% fields. These are diagnostics, not an 'exactness score'. Field comparison identified the source rule rendering one pixel above the CSS border; corrected before the next comparison. Font optical sizing is held at the original named instance, not browser automatic optical sizing.

Browser auth checks: invalid credentials retain entered email/password and show the error; valid seeded customer authentication reaches dashboard; signup step 2 focuses its heading and returning focuses name with entered values retained. Production builds must run with the development server stopped because both otherwise write `.next`.

The `.fig` and PDF differ in at least one browse example photo: `.fig` node31:81 explicitly uses the archived money image. The live source `.fig` is authoritative; this was not silently replaced with the older PDF photo.

The public browse reference now includes native search feeding `/jobs?q=…`, alongside clearly marked source examples. The live jobs grid uses the source 187px photo tiles and 6px gaps; current status/pay/filter controls extend the historical design. Job details and post-job flows use source-derived mobile geometry while retaining modern business fields. These adapted screens are not pixel-identical historical screens.

The dashboard now uses measured original quote-card typography, widths, photo sizes and shadows, with expanding heights for current stages. No original admin/payroll/settings screen exists in the source. The approved Roboto Flex substitution preserves source font sizes and layout positions.

## Integrated verification before the Roboto Flex update

- Lint, TypeScript, production build and all 16 regression tests pass.
- Browser sweep: 16 route/role combinations at 390px; all rendered without server errors or horizontal overflow. Customer access to another customer's job remained blocked.
- Required-photo posting review retained the selected file, focused the review heading and restored title focus on Edit details. The test did not submit a job.
- Centered mobile frame checks at 1440px passed for admin operations, admin settings, profile and verification: content width/scroll width both 390px.
- The source mobile reference remains 390px. Smaller-than-source reference screens and new business/desktop layouts have not been certified as exact originals.

## Concurrent remote work

Remote `web-app` advanced to59c5964 with three QA documentation commits; no competing application code changed. The new round-1 reports identify an existing certificate validation/rejection/replacement and payout-hold gap. The CoC upload must not be mistaken for a validated legal certificate. That backend/workflow change is not implemented or hidden by this visual revision. The newer QA protocol also requests future in-app certificate forms; this remains a separate unfinished requirement.

## Approved webfont and demo-fixture update

Roboto Flex is bundled with its OFL license and provenance. No runtime Google Fonts request or installed SF font is required. The login screenshot was reviewed at390×844 after substitution. Native SVG controls preserve source locations while replacing nonportable private-use font symbols.

Lint, TypeScript, all16 tests and the production build passed after integration. Production browser checks repeated authentication, signup focus/retention,16 route/role combinations, required-photo review/edit retention, and four1440px desktop framing checks. Adding real demo photos exposed a24px overflow from a visually hidden caption; corrected and rechecked at390px viewport/390px document width. Gallery images load, zoomed arrow use retains the selected image, and Escape closes with focus returned to the opener. Both bundled font aliases loaded successfully. A clean temporary SQLite database accepted the schema and full updated seed; the existing local database was not reset.

Demo fixture origins and their explicit limitations are in demo-assets.md. Frontend journey coverage and remaining preview/backend boundaries are in frontend-coverage.md. Existing test evidence with the source SF face predates this update and is not a pixel score for the substitute font.

## QA follow-up after b3bf5c3

Independent QA identified five P2 findings. Browse nested SVG sizing now targets only the outer390px canvas; icon colors are explicit source-derived hex values. Login/signup and browse/search now reflow at320px without canvas scaling, while390px geometry remains unchanged. The generic shell navigation no longer overlays form focus. Verified-licence badges use opaque #E8F4E3 with #326C20 text. These badge/shell changes affect adapted controls, not original CTA colors.

Posting stores a versioned, expiring24h text draft in sessionStorage scoped by authenticated user. Drafts include the address; the UI explains local storage and provides Discard. No photos/passwords are persisted. Expired-session tests confirmed reauthentication returns text/review state, asks for photo reattachment, blocks submission without photos, and clears the matching draft after successful posting.

Customer completion, admin sign-off and variation decline now have focused review and pending controls. Document access offers availability checking, failure/retry/help and the original link; availability is not certificate validation and does not pause auto-release. Settings fields disable during saving. Reviews now accept blank comments with required stars, trim text and retain1000-character limits; empty paragraphs are omitted. This is the specifically requested minimal validation adjustment, not a broader backend expansion.

Lint, TypeScript,16 tests and production build pass. Browser checks cover all four former overflow routes at320/390, restored browse icon sizes/colors, session draft recovery/success cleanup, profile focus visibility, document failure/retry and one successful blank-comment review. Source green/white CTA contrast and icon-shape approval remain unresolved visual limitations.

Customer/admin completion confirmation browser checks focus the review explanation and return focus on cancel; each completed local fixture has exactly one payroll record. This does not represent a transfer of money.

## Browse composition correction after scoped QA sign-off

The saved live source31:15 capture (`original-browse-properties.jpg`) shows a64px navigation band at y780 in the390x844 frame, whereas the archived decoded31:144 transform is stale at y2217. The web rendition now positions the band at780 and paints it after the scrolling artwork; its five semantic links target Home, Search, Jobs, Messages and Account. Source header nodes31:38 and38:254 identify menu-left at22/32 and plus-right at331/35; corrected their substituted glyph names and linked the actions to app navigation and job posting. The icon shapes remain disclosed portable substitutions, not exact SF glyphs.

Production screenshot reviewed at390x844 against the saved original composition. Browser geometry confirms navigation x0/y780/w390/h64 with all five links visible. Browse/search overflow checks pass at320/390/768/1440. Search navigation and unauthenticated Post job return destination passed. Lint, TypeScript, production build and16 tests pass. Independent QA previously granted scoped functional sign-off for59bd0d6 andba8fb43, including the follow-up guidance/price/earnings/offline states; this correction addresses the remaining concrete header/nav composition defect, not blanket exact visual approval.
