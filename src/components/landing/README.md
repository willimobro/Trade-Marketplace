# Customer landing page

Branch `feature/customer-landing-20261022`, based on inspected deployed checkpoint `95415b2`.

The public `/` route introduces the customer journey: photo-led Forest/White split, "Sorted in a flash.", "What needs doing?", a primary post-job action, common trades, three steps and concise reassurance. Tradie acquisition is secondary. The footer retains a concise no-live-booking/payment notice; the repeated sample-details prompt beside the first CTA has been removed. No reviews, customer totals, pricing discounts, timing guarantees, insurance claims or launch claims are introduced.

## Integration

The current `/` route shows the existing marketing landing to guests and signed-in accounts before any job/settings query. Signed-in visitors get a Dashboard link in the landing header and an outlined return action beside the existing post-job entry. These read the current account mode without changing it; the wordmark/home destination is `/` in both modes. `/?view=search` retains its existing role-scoped browse behavior and opposite-mode preview destinations. The App Router `searchParams` prop is awaited. No authentication, security gate, shared token or job action is changed by this home correction.

The landing CSS hides the existing desktop workspace header only when this landing component is present, using `#application:has(.landing) > header`. It then supplies a customer header on all widths. Removing the component restores the workspace header. This keeps the header adaptation local to landing scope. Supported current browsers implement `:has()`.

All primary CTAs and the category-section link enter `/jobs/new`. Authentication continues through the existing login `next=/jobs/new` flow; this page does not create or submit a job. Category tiles describe the four existing posting categories and do not pretend to preselect an unconsumed query parameter. The existing per-trade readiness notices remain in the job flow.

## Design and sources

- Visually inspected all 32 pages of the preserved `Trade Marketplace Brand Guidelines.pdf`, plus the original Figma page screenshot. Reused the existing wordmark, bolt and category artwork. The PDF's electrical-first copy was adapted to Matthew's all-trades scope.
- Uses existing Forest, Cream, Leaf, Lime, White and muted/focus tokens. Leaf actions retain Forest labels. Self-hosted Trade Display uses 900 / width 151 / optical size 28; Trade UI uses 400 or 700 / width 100 / optical size 14. No shared token changes or new font dependencies.
- Hero: Antoni Shkraba, [A Man Renovating a Home](https://www.pexels.com/photo/a-man-renovating-a-home-5493656/), under the [Pexels licence](https://www.pexels.com/license/), checked 22 October 2026. It permits free website use and modification; no endorsement is implied. A visible photography credit is included. No Magnific download or generation credits spent.
- Replaceable, locally served WebP assets, dimensions, byte counts, SHA-256 hashes and original source paths are in `public/landing/sources.json`. Original brand assets are unchanged. The four optimized images total about 144 KB before Next image optimization; the hero is prioritized with responsive sizing.
- Hierarchy research used primary current pages: [Uber Australia](https://www.uber.com/au/en/), [Uber Ride](https://www.uber.com/au/en/ride/), and [Airtasker how it works](https://www.airtasker.com/au/how-it-works/). The transferable idea is an immediate customer action, then service choices and a short process explanation. No assets or layouts are copied from them.

## Verification checkpoint

Own `node_modules`, own `.next`, Node 22, and an explicitly disposable `trade-landing-runtime-*` SQLite database. No shared dependencies, database or running preview were modified. `npm ci` left the lockfile unchanged.

- Full ESLint passed.
- `npm run preview:build` passed, including TypeScript and a temporary migrated build database.
- `npm test`: 56 passed, zero failures.
- `npm run preview:test`: 8 passed, zero failures.
- HTTP smoke checks cover guest landing, preserved search, all three signed-in roles, local WebP assets, Next hero optimization and the existing streamed login return path.
- Coordinated browser review inspected 320, 390, 768, 1024 and 1440px layouts and confirmed the actual stock photo/category assets load. The 320px Construction heading was reduced to 14px after an inner-card overflow was detected; display axes remain unchanged.
- Keyboard Tab revealed the shared skip link, Enter focused `main-content`, and sequential Tab reached the primary CTA with a visible 3px blue outline. Enter followed `/jobs/new` to `/login?next=%2Fjobs%2Fnew`; the disposable customer login returned to the existing job form. No job was submitted. At this historical checkpoint, signed-in home restored browse; the current home correction above supersedes that behavior and requires its own browser check.
- Screenshot evidence is delivered outside the repository in the task's `evidence/landing/` directory, with desktop/mobile full pages, 768/1024px layouts, CTA focus and the existing job form. No real data was used.

No push, pull request, deployment or production-data action is part of this branch.

## History/hash regression correction

Independent QA found that clicking a native `#how-it-works` anchor, following the footer tradie link, then using Back restored the landing URL while retaining the tradie page. Reproduced on the production build before the fix. Both landing anchors now use Next `Link` with `/#how-it-works`, keeping the hash navigation in the same router history as route changes; markup appearance and styles are unchanged. A landing-only effect restores this exact fragment after the streamed content and fonts are ready, covering direct mobile fragment loads where the native target was not yet present. It cancels on unmount and rechecks the fragment before scrolling; no global history listener or shared router changes.

`qa/regressions/landing-history.mjs` runs through an agent-owned cua_repl tab on a disposable loopback preview, without launching another browser or writing any product data. It checks the rendered route and URL through the anchor, tradie navigation, repeated Back/Forward, same-page history, direct anchor navigation and reload, including section position. Run the hero anchor at 390 and 1440px and the header anchor at 1440px. Evidence and results are in the task's `evidence/landing-history/` directory. The original checkpoint fails the regression at Back to the landing hash.

Final result: all 33 browser checkpoints passed across those three scenarios. Back, direct loads and reloads place the section about 48px below the viewport edge using the existing scroll padding/margin. No browser console warnings/errors were recorded. The final production build, ESLint/TypeScript, 56 application tests and 8 preview-security tests pass. No visual styles, shared routing/layout, product actions or data changed in this correction.
