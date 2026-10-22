# Find Work navigation and grid checkpoint

Base: deployed `92c8ae861fb1534de9ffa0d5ebf518494bec14c2`.

Reproduced in the isolated production app: actual Customer account → Trade mode → Available jobs → Your jobs → Find work changed the URL to `?quoteView=feed` while the Available jobs tab/content remained selected. The component initialized tab/filter only at mount and later wrote its local state back to history. It now derives tab/filter directly from Next search parameters; explicit controls push bounded URLs. There is no route-overwriting effect or skipped-job session lookup. Desktop/mobile active navigation also distinguishes Find Work from Your Jobs.

The quote feed now uses the same multi-card grid as Available Jobs. All quoting fixtures stay browsable, including the viewer's saved orange Quoted and green Accepted states. Quote/edit/readonly actions follow that account's ledger; opening a detail never awards points. Skip/Next controls are retired. Detail returns carry the actual opened job ID/filter and focus the returned card.

Job details now contain Description, Location and Comments in one continuous body. Existing description/scope/guidance/property/access/timing information is retained. Comment drafts, posting, hash navigation and accepted-editor focus logic remain intact.

Tradie monetary values use semantic `--trade-pay-amount: #326c20` through `.trade-money`, including cards, saved quotes and queued/manual-payroll amounts. Orange actions and explicit queued/paid labels stay distinct. Customer money is unaffected by the trade-only selector.

Integrator verification: isolated production build (lint/type validation), 128 application and 8 preview-security tests pass. Browser-reproduced baseline and corrected Customer → Trade flow, Your Jobs → Find Work, Available ↔ feed Back/Forward, direct filtered URLs/reload, multi-photo controls, detail quote +1 point, saved comment, Comments focus/hash, returned card focus and accepted overlay with unchanged 4 points. Actual 390/1440 widths showed no horizontal overflow and uniform cards; 390 filtered cards 358×658, 1440 filtered cards 588×888. No publication/deployment at this checkpoint. Independent QA remains required.

Later user direction adds a separate visual follow-on: larger Accepted/Complete photo labels, consolidated Forest header and concise ordinary UI copy; signed-in root/logo must open the marketing landing with a mode-preserving dashboard return. This checkpoint allows the routing fix to be tested independently of those later changes.
