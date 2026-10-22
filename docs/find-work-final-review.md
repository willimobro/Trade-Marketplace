# Find Work, visual hierarchy and signed-in home review

Base: deployed `92c8ae861fb1534de9ffa0d5ebf518494bec14c2`. The earlier core checkpoint `2ff5098c0bbf1becd5228551da1c0758e9e5aebc` passed independent QA for routing/history, the multi-job grid, uniform cards, galleries, personal overlays, one quote reward and consolidated detail content. This follow-up is a local candidate, not a deployment.

## Delivered follow-up

| Request | Result |
| --- | --- |
| Distinct Your Jobs and Find Work | `/dashboard` defaults to claimed/Your jobs; explicit `quoteView=feed` opens Quote more jobs. Workspace navigation exposes actual links with `aria-current`, while URL parameters remain the source of truth. |
| One Forest header | Greeting, trade/region and Points share one Forest band. Customer Your jobs has one visible title and an outlined Post a job entry. |
| Concise ordinary screens | Removed workspace sample/demo banners, repeated promotional eyebrows, competing headings and explanatory footers. Functional storage errors, unsent-draft guidance and action-level transaction/delivery limitations remain. |
| Larger final photo states | Accepted and COMPLETE use the existing display type at 24 px mobile/36 px desktop. Small conversation thumbnails remain compact. Complete still takes precedence over quoted/accepted. |
| Green tradie money | Shared `--trade-pay-amount: #326c20` includes quote values, prices, message prices, individual payroll amounts and the previously missed queued/marked-paid summary totals. Counts and pending/paid status labels retain their meanings; no calculation changed. |
| Signed-in home | Root and wordmarks open the existing marketing landing for every role. Header/hero return links read the selected mode without changing identity or stored drafts. Explicit search remains role scoped. |
| Action hierarchy | View job, return and navigation actions are outlined; quote/claim/price commitments remain solid. Notification navigation links are also outlined. Marketing landing styling is preserved. |

## Integrator verification

- Production `preview:build` passes, including lint and type validation; 132 application tests and 8 preview-security tests pass. No dependency/schema/security configuration changes.
- The signed-in home browser regression passed all eight combinations: actual Customer/Tradie × selected Customer/Trade × 390/1440 px. Root, wordmark, mode-aware return, reload, Back/Forward, search isolation and identity were checked.
- Rendered payroll summary and detailed amounts computed to `rgb(50, 108, 32)`; queued and marked-paid labels were unchanged. Green contrast is 6.36:1 on white and 5.41:1 on Cream.
- Local browser evidence uses only the existing disposable synthetic database and browser-local fixtures. No real data, uploads, credentials or payroll records were changed.

Screens captured and inspected at 390/1440 include the landing, trade feed, Jobs, Your jobs/Quoted jobs empty states, customer jobs/posting/messages, tradie messages, account, notifications, support, and job detail/comments. The corresponding route checks had no horizontal overflow. This is a review of these visible states, not a claim that every route/error state in the product was retested.

Evidence is outside the repository under `task/evidence/find-work-final/`; the screenshot manifest is `screens.json`. Earlier source/core-flow evidence is in `task/evidence/find-work-grid/` and the independent QA report for `2ff5098`.

## Focused final QA

Review the final candidate on its own isolated fixtures. Target the later deltas: default Your jobs versus Find Work, workspace navigation links/history/direct URLs, unified header and concise labels, larger Accepted/COMPLETE overlays, green payroll summary values, and signed-in landing/root/return for both identities and modes. Recheck the customer posting link and conversation controls after their copy-only changes. Core point accounting and five-point claims are unchanged from the independently cleared checkpoint.

Final browser caveat: after repeated local production rebuilds and viewport changes, the integrator's browser session produced inconsistent query-only link/tab activation results. The normal Account → workspace → mobile Search path succeeded, but a subsequent scripted workspace-tab check did not settle at its destination. Workspace view controls now expose explicit Next links and `aria-current`; this last navigation delta must be independently checked before publication. This report does not grant final routing signoff.

### Navigation-only correction after independent NO-GO on `be5bfce`

Independent QA reproduced the failure on fresh isolated fixtures, including actual Tradie desktop Find Work and workspace mouse/Enter activation. Correct hrefs, received click events and working direct page loads narrow the issue to the intercepted same-path navigation, rather than URL parsing or a pointer-covering element. The exact framework/cache cause is not asserted.

`DashboardNavigationLink` now leaves `/dashboard` destinations as native anchors, bypassing Next's click interception for those view changes. Non-dashboard destinations keep Next links. Main desktop/mobile navigation and workspace view links use this one boundary. No visual styling, model, authorization, payment or data behavior changed. The trade-off is a document load for dashboard navigation; mode and saved drafts remain in their existing browser persistence, and normal modifier clicks/history remain native.

The corrected production build passes lint/type validation and 13 focused navigation/mode/home tests. Rendered-browser regression `tests/browser/dashboard-navigation.cua.js` passed all four actual-identity/width combinations: actual Tradie and actual Customer switched to Trade, each at 390/1440. Each combination completed three main Your Jobs → Find Work → Your Jobs cycles with Back/Forward, all four workspace destinations by both mouse and Enter, eight unfiltered feed cards, and two Plumbing cards after filter/reload. Native links retain `aria-current` and there was no horizontal overflow. Existing Sarah's accepted quote/four points and Jack's separate three points remained intact.

Screenshots for both identities and widths plus `results.json` are in `task/evidence/navigation-fix/`. This supersedes the integrator's earlier navigation caveat for local verification; independent targeted QA and deployment approval remain outstanding. The broader visual pass is not repeated.

## Remaining boundaries

Quote/comment/claim and opposite-account-mode journeys remain isolated frontend simulations with browser persistence. No real booking, payment, message delivery, password recovery, verification service or cross-device sync was added. Necessary warnings stay beside consequential actions or in collapsed preview controls. Wider backend integration and the full product-wide state audit remain separate work. The current hosted preview stays at `92c8ae8` until this candidate is independently cleared and publication is requested.
