# Brand guideline alignment — separate review checkpoint

Based on `af77e7e`, in a separate worktree/branch so its independent QA remains stable. Source: the parent's verified visual review of all 32 pages of **Trade Marketplace Brand Guidelines.pdf**, Library `libfile_14536222869c8191b0007527429b022e`. The PDF itself was not re-downloaded or re-inspected in this task. Original 2022 Figma remains visual authority (p31).

## Applied without changing product scope

| Guideline | Previous shared implementation | Correction |
| --- | --- | --- |
| Primary 55px / radius 11, Leaf action | 48px / radius 12, Lime default | Minimum 55px, radius 11, semantic Leaf action; Forest label retained. Content may grow for wrapping. |
| Secondary white / 2px action stroke | 1px decorative grey border | White, 2px semantic action stroke, Forest label. |
| Cards radius 11 / 0 4 4 black 25% | Radius 16 / soft 20px blur | Existing measured category radius and shadow reused by shared card utility. |
| Square fields / #52645B border | Radius 12 shared fields; radius 11 signup detail fields | Radius 0; accessible border retained. Original auth underline geometry stays unchanged. |
| Pills 30px; hero 61px / display 24 | Fully rounded chips; no named hero utility | Shared chip radius 30 and reusable hero utility. No unrequested hero/bolt artwork inserted. |
| UI width 100 / optical size 14; button 14 bold | UI axes not explicit; buttons semibold | Explicit UI axes and 700 button weight. Display utilities explicitly 900/151/28, zero tracking. |
| Semantic modes | Hardcoded shared action colours | `--trade-action`, `--trade-signature`, `--trade-link`; root `data-mode` reflects customer/tradie role. Both modes remain green until orange approval. |

Added the documented 64/36/24 display, 28 price, 20 name, 18 section, 15 overlay and 16/14/11 UI size tokens. Existing `page-title` and `section-title` utilities use 36 and 18 respectively. Scoped original-screen typography is not indiscriminately resized. Signup/account secondary surfaces now reuse radius tokens instead of unrelated 12/16px corners.

## Confirmed and preserved

Forest shell/navigation, Cream canvas, Mint, White, Leaf and Lime already match the checklist. Forest coloured-button text, accessible links/fields, focus/error colours, self-hosted Roboto Flex and its OFL, original vector wordmark/bolt and extracted prototype navigation silhouettes are retained. Browse cards keep Matthew's photo/name/pay/km-only presentation. Existing all-trades selection and simulation remain. No schema/actions/calculations, credentials, deployment or hosted-preview branch changes.

## Deferred, with reasons

- Orange trade accents (`#FF8200`, `#ECA154`, `#9E4A00`): explicit user decision pending. No orange CSS selector is enabled.
- Wordmark is an existing vector asset; do not replace it with a newly typeset approximation or introduce a font dependency merely to restate the Inter specification.
- PDF approximate 120% typography leading is applied to shared button/display utilities. Long-form body text keeps 1.5 for current readability pending visual review; original context-specific line heights remain. No claim of exact global PDF parity.
- Screen-scoped modules still contain local rounded panels, buttons and type scales. Further reconciliation needs screenshot review; this batch corrects shared primitives and the newly identified signup/account exceptions, not every module.
- No responsive breakpoints/grids are inferred from the PDF. Existing responsive behavior must be rechecked after these shared changes.
- Electrical-first PDF copy does not override Matthew's all-trades instruction. Taglines and prompts are not substituted broadly without content review.
- Hero bolt placement/opacity, complete sheet/chip audit and real-photo treatment require per-screen review; no speculative artwork changes.

## Review boundary

No browser actions or runtime fixture changes during QA ownership. Code checks cannot certify the changed shadows, wrapping, hover states, content clearance or responsive appearance. Independent visual review at 320/390/768/1024/1440 is required before integration or deployment, especially checkout action wrapping, signup details, form rows, card density and keyboard focus above pinned navigation.

Local checks: full lint, protected production build (including TypeScript) and whitespace checks passed. No runtime visual signoff is claimed; QA owns the browser. The original account checkpoint remains af77e7e and the hosted preview remains f23936b.
