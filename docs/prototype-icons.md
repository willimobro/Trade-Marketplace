# Temporary original navigation outlines

Matthew explicitly authorized using the exact original icons for the prototype, with replacement before launch if required. `src/components/original-nav-icons.json` isolates the five cached Figma glyph outlines. `SourceIcon.tsx` selects them for navigation and preserves accessible labels on the containing controls. No Apple font binary is embedded. Other control icons remain independent drawings; this is not a claim that every icon has been replaced.

| UI role | Original node | Unicode | Source style |
|---|---|---|---|
| Home |31:139|U+10039F|SF Pro Regular|
| Search |31:140|U+1002AB|SF Pro Semibold|
| Jobs |31:142|U+10035D|SF Pro Regular|
| Messages |31:141|U+100324|SF Pro Regular|
| Account |31:143|U+100269|SF Pro Regular|

All source text is26px, tracking0, line-height100% in Figma. Cached glyph advance, baseline and actual outline are preserved; they are not fitted into an arbitrary24×24 drawing box. Font glyph names on this Mac are `uni10039F.medium`, etc.; those are not verified SF Symbols catalogue names. The source-exact Jobs glyph is a stacked card with lines and a circle, and Messages is an oval bubble. Do not silently replace these with a briefcase or rectangular speech bubble based on a guessed catalogue name.

## Prelaunch gate

This prototype choice does not establish general web redistribution clearance. Apple's official SF Symbols27 disk image was downloaded and inspected read-only; no app was installed, executed or new agreement accepted. Its bundled English `License.rtf` Sections2A–2D limit relevant mockup/template uses to specified Apple platforms; Section2E excludes non-Apple mockup uses and ungranted website-content uses. Before launch, obtain applicable permission or replace these isolated outlines with an approved licensed set. Preserve this note in any review handoff.

Source file: original Figma `WurSo76mY67lO23D4Zlu7v`, archived `Trade Marketplace 1.fig`, decoded locally without modifying the archive. Official package: https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-27.dmg?2
