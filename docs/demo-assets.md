# Local demonstration assets

These fixtures support the local seed's gallery and document-viewing flows. They are not real evidence of a job, a completed installation, or professional certification. No remote hotlinks or new external images are used. Source originals remain unchanged.

| Fixture | Origin |
|---|---|
| `/demo/wiring-demo.svg` | Embedded unchanged JPEG bytes from `public/original/browse-a8864402f9646efcef595fe0ee2677d285589ea3.jpg` (wiring photograph) |
| `/demo/pipework-demo.svg` | Embedded unchanged JPEG bytes from `public/original/browse-7905217e5451f25e95c4bbe9aca6b4d14008dafb.jpg` (pipework photograph) |
| `/demo/not-a-certificate.pdf` | Newly authored one-page demo document with a large DEMO ONLY watermark and explicit NOT A CERTIFICATE heading |

The two JPEG sources were recovered from the user-provided original Trade Marketplace Figma archive `WurSo76mY67lO23D4Zlu7v`. Each self-contained SVG embeds the raster directly and adds visible demo labels across its centre and outer bands. This avoids a remote image dependency and keeps the label visible in cropped gallery thumbnails. They intentionally do not pretend to match the fictional electrical job scopes; the seed descriptions also disclose this mismatch. The same pair is reused for every seeded job and the seeded extra-work request.

Source SHA-256:
8887b6bab309de9dc0ccb971b208772a2f70dd6cd568d42d478c477948aef438  public/original/browse-a8864402f9646efcef595fe0ee2677d285589ea3.jpg
3dc838bc94a38f5129de648742874511514509feef988536800b9828cc578d6a  public/original/browse-7905217e5451f25e95c4bbe9aca6b4d14008dafb.jpg

The PDF uses standard Helvetica and contains no signature, licence, inspection, approval or compliance claim. The seeded CoC record uses identifier `DEMO-NOT-A-CERTIFICATE` and the working `/demo/not-a-certificate.pdf` URL solely to exercise existing UI. It is not a legal certificate.

`prisma/seed.ts` attaches two job-level photos to every seeded job and two variation-level photos to the existing variation. A normal seed rerun recreates the database records using the same asset URLs. **The existing seed wipes its target database.** This asset change did not execute it or modify any database. Run it only against a deliberately disposable local database; preserve existing data otherwise.
