# Trade Marketplace UI pack

Authority: Matthew's approved original [Figma](https://www.figma.com/design/WurSo76mY67lO23D4Zlu7v/Trade-Marketplace-1). The later proposed redesign is not visual authority. Shared measured tokens live in `src/styles/brand.css`, imported by `src/app/globals.css`. Existing component modules retain screen-specific geometry; do not impose one universal spacing/radius on every original screen.

## Typography and assets

Self-hosted Roboto Flex is the explicitly approved web-only substitute. `Trade Display` uses width151, optical size28 and weight900; `Trade UI` uses normal width. Font licence: `public/fonts/roboto-flex/OFL.txt`. Source sizes: auth heading36px, browse24px, estimate28px, section labels18px, ordinary body16px and compact labels14px. Original auto line heights are contextual, not universal numeric line heights. Preserve original vector wordmark and archived illustrations in `public/original`.

## Measured shape and spacing

Source reference viewport390px. Browse inset16px; original auth/form inset36px; category tiles159×162px separated12px; source action/category radius11px; job-photo tiles5px; source field radius0px. Source category shadow0 4 4 black25%, action10%, header5%. Navigation64px plus device safe area. At320px reflow content; do not shrink the whole canvas. The next horizontal card is deliberately partially visible. Scrollable tracks must support touch, keyboard, focus and reduced motion.

## States

Use the existing SubmitButton and ConfirmAction for pending/consequential actions. Show errors next to their controls and preserve entered values. Disabled controls must explain unavailable capabilities. Focus uses a visible blue outline; pinned navigation requires content clearance and scroll margin so fields remain visible. Error color#A12424. Keep actual payment controls explicitly test/demo; ordinary navigation/account screens do not need a development banner.

## Icons: unresolved permission

Matthew subsequently authorized source-exact navigation icons temporarily for the prototype. `SourceIcon.tsx` now reads the five archived outlines from `original-nav-icons.json`; other controls remain independent drawings. This does not establish a general web licence. Apple's SF Symbols27 bundled licence has now been inspected read-only and limits relevant uses to specified Apple platforms. See `prototype-icons.md` for exact node/codepoint/style mappings and the prelaunch replacement/permission gate.

## Contrast limitation

Some original white-on-leaf CTAs fall below WCAG AA. Preserve source fidelity pending Matthew's decision; do not claim full AA compliance. New status badges and readable workflow amounts use stronger forest/dark-green text. Decorative borders and required input boundaries are different uses; verify each in context.
