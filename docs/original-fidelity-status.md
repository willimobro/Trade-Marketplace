# Original Figma fidelity work in progress

Authority: https://www.figma.com/design/WurSo76mY67lO23D4Zlu7v/Trade-Marketplace-1
The separate 42-screen redesign is not an approved visual reference.

## Source and method

Original archived `Trade Marketplace 1.fig` SHA-256: `d94d9a8189941ade8852ae17e4deadc1edd6d85a115699606a9fac26d2fb794f`.
The archive was decoded read-only (1,694 nodes). Original raster/vector artwork is exported under `public/original`; original files remain unchanged.
Login reference: node 7:8, 390×844. Layout, fills, button radius 11, inside secondary stroke 2, image transforms and text baselines come from source node data and were independently checked in the Figma inspector.
Live text remains accessible DOM/SVG text, not outlined font binaries or a screenshot background. Source glyph positions preserve the heading kerning. Installed SF Pro's named Expanded Bold instance is `wdth=132, opsz=28, wght=760`; merely asking Chrome for the local named face lost the width axis.

## Limits and publication gate

No SF Pro font binaries are bundled. These pages use locally installed source faces. Devices without them show a fallback warning; universal pixel equivalence is not established. Font distribution rights need resolution before a cross-platform exact-font release.

Original references cover mobile layouts. Centered source-width rendering on larger displays is deliberate; it is not an original desktop design. New business fields and current backend flows require clearly identified adaptations. The draft desktop sidebar and Poppins have been removed. Residual account/admin/support routes use a source-derived mobile shell; their content layouts are adaptations and are not original-reference matches.

Do not describe this branch or PR as an exact completed reproduction. Same-viewport source comparison and functional checks precede publication. Login initial screenshot comparison found and corrected a white label mismatch and the missing variable-font width axis. Native editable field baseline behavior still needs final comparison; browser/Figma anti-aliasing and the inspector's selection border are not source design geometry.

## Functional corrections retained

Clear claimed/unavailable recovery, readable message timestamps, saved cancellation outcomes, and focus return for cancellation and edit-details controls. Backend contracts and pricing behavior are unchanged.

## Source comparison evidence (local work session)

The recovered PDF pages 2, 3 and 6 have native 390×844 bounds and were rendered at that exact size. Login production vs PDF was inspected side by side; initial per-channel mean absolute pixel differences were 0.24% artwork, 0.22% heading, 0.54% buttons, 2.10% fields. These are diagnostics, not an 'exactness score'. Field comparison identified the source rule rendering one pixel above the CSS border; corrected before the next comparison. Font optical sizing is held at the original named instance, not browser automatic optical sizing.

Browser auth checks: invalid credentials retain entered email/password and show the error; valid seeded customer authentication reaches dashboard; signup step 2 focuses its heading and returning focuses name with entered values retained. Production builds must run with the development server stopped because both otherwise write `.next`.

The `.fig` and PDF differ in at least one browse example photo: `.fig` node31:81 explicitly uses the archived money image. The live source `.fig` is authoritative; this was not silently replaced with the older PDF photo.

The public browse reference now includes native search feeding `/jobs?q=…`, alongside clearly marked source examples. The live jobs grid uses the source 187px photo tiles and 6px gaps; current status/pay/filter controls extend the historical design. Job details and post-job flows use source-derived mobile geometry while retaining modern business fields. These adapted screens are not pixel-identical historical screens.

The dashboard now uses measured original quote-card typography, widths, photo sizes and shadows, with expanding heights for current stages. No original admin/payroll/settings screen exists in the source. Alternative webfont research is pending user visual approval; no substitute has been applied.

## Integrated verification

- Lint, TypeScript, production build and all 16 regression tests pass.
- Browser sweep: 16 route/role combinations at 390px; all rendered without server errors or horizontal overflow. Customer access to another customer's job remained blocked.
- Required-photo posting review retained the selected file, focused the review heading and restored title focus on Edit details. The test did not submit a job.
- Centered mobile frame checks at 1440px passed for admin operations, admin settings, profile and verification: content width/scroll width both 390px.
- The source mobile reference remains 390px. Smaller-than-source reference screens and new business/desktop layouts have not been certified as exact originals.

## Concurrent remote work

Remote `web-app` advanced to59c5964 with three QA documentation commits; no competing application code changed. The new round-1 reports identify an existing certificate validation/rejection/replacement and payout-hold gap. The CoC upload must not be mistaken for a validated legal certificate. That backend/workflow change is not implemented or hidden by this visual revision. The newer QA protocol also requests future in-app certificate forms; this remains a separate unfinished requirement.
