# Local demonstration assets

The 26 seeded jobs are fictional requests attached only to the existing `@demo.test` accounts. Their descriptions explicitly identify them as demo jobs. Stock photographs provide varied visual context; they do not depict the fictional address, prove a fault, show completed work, or establish professional certification.

## Local photographs and attribution

Twelve distinct photographs were downloaded on 21 October 2026 from the official Unsplash image hosts. Before download, each official photo page was checked: its image metadata names `https://unsplash.com/license` and declares `isAccessibleForFree: true`. These are free Unsplash photographs, not Unsplash+ assets. The [official Unsplash License](https://unsplash.com/license) permits downloading, copying, modifying and distributing these photographs for commercial and noncommercial uses. Attribution is retained here and in the runtime manifest even though that license does not require it. The photos are part of a marketplace demonstration, not a competing stock-image service or standalone image products.

All photographs are local JPEG files under `public/demo/jobs/`. The application does not hotlink remote images. Each download requests a 1,200-pixel width, JPEG format, sRGB and quality 82 from the source image host; the originals are not edited into fabricated job evidence. A contact-sheet review confirmed property/interior/material scenes without visible people or private faces. The set deliberately includes fixtures, surfaces, renovation stages, interiors and exteriors instead of repeating the previous two images.

`src/lib/demo-job-assets.ts` is the central attribution manifest:

- `DEMO_JOB_ASSETS`: entries with `{ id, url, title, source: { name, url, photographer }, license: { name, url } }`.
- `demoJobAssetForUrl(url)`: finds source attribution for a local URL; unknown or real-upload URLs return `undefined`.
- `demoJobPhotoUrls(...ids)`: resolves typed asset IDs for synthetic fixture records.

All rows below use the [Unsplash License](https://unsplash.com/license).

| Local file (`/demo/jobs/`) | Photographer / contributor | Official source page |
|---|---|---|
| `kitchen-sink.jpg` | Bluewater Sweden | [a kitchen with a sink and a faucet](https://unsplash.com/photos/a-kitchen-with-a-sink-and-a-faucet-NcbU7Etc4mY) |
| `bathroom-vanity.jpg` | Lotus Design N Print | [modern bathroom with shower and vanity](https://unsplash.com/photos/modern-bathroom-with-shower-and-vanity-g51F6-WYzyU) |
| `timber-fence.jpg` | Justin Schwartfigure | [brown wooden fence under blue sky during daytime](https://unsplash.com/photos/brown-wooden-fence-under-blue-sky-during-daytime-LVwbWJyOJro) |
| `timber-detail.jpg` | Se. Tsuchiya | [a close up of a wooden surface with nails](https://unsplash.com/photos/a-close-up-of-a-wooden-surface-with-nails-DKpkc0QQPzs) |
| `kitchen-renovation.jpg` | immo RENOVATION | [A kitchen under renovation with white cabinets covered in plastic and brown paper](https://unsplash.com/photos/kitchen-renovation-with-white-cabinets-UqNEbyRQ660) |
| `paint-roller.jpg` | Karl Solano | [A paint roller with a red handle in a tray of white paint](https://unsplash.com/photos/paint-roller-in-white-paint-tray-eQ-8iUrb07g) |
| `ceiling-light.jpg` | 莎莉 彭 | [white dome light](https://unsplash.com/photos/white-dome-light-1vJgJC3De5g) |
| `house-exterior.jpg` | todd kent | [gray wooden house](https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc) |
| `roof-tiles.jpg` | Michael Jasmund | [A pattern of dark grey roof tiles with sharp shadows in bright light](https://unsplash.com/photos/dark-grey-roof-tiles-pattern-m_vEaZizd2s) |
| `garden-shed.jpg` | Kailun Zhang | [Open white garden shed with green door and gardening supplies](https://unsplash.com/photos/open-white-garden-shed-with-green-door-and-gardening-supplies-s399fgCQN_s) |
| `deck-patio.jpg` | Point3D Commercial Imaging Ltd. | [a deck with chairs and tables on it next to a house](https://unsplash.com/photos/a-deck-with-chairs-and-tables-on-it-next-to-a-house-adTeb8MrQZs) |
| `room-renovation.jpg` | Stefan Lehner | [A room under renovation with metal support poles, debris, and tools on the floor](https://unsplash.com/photos/room-renovation-with-metal-support-poles-biRt6RXejuk) |

Downloaded-file SHA-256 (use these to verify the checked-in bytes):

```text
2fecf4e27e687e3ea7a6657190136a191a02eb900c46c3662e56381f31c247ca  public/demo/jobs/kitchen-sink.jpg
e64782179f9042e9e344a0c24d62a307b711bcc6934cb51e2235ac016c093e73  public/demo/jobs/bathroom-vanity.jpg
b9baf8493816f53fb8805637d17e5fe9269d0f178ca586cfca6c1e2a61ae20b9  public/demo/jobs/timber-fence.jpg
2ed36ba9313fae707d88cd791f15641cd58074590bcebeb37b51cc2882020bce  public/demo/jobs/timber-detail.jpg
30f53dcdf34ae259c72d8e3e713e7c8a89a9cfd293f63e9115d3f64335c31f98  public/demo/jobs/kitchen-renovation.jpg
7cbc88bb4e3b5a8dc0d9034c780ec55ebcd9bbf5773aee88c084425e6c2866e6  public/demo/jobs/paint-roller.jpg
a8f768cbfbd9e6941012a9f8160c94ae0f3fa30d17daf3affcacdbae908ce807  public/demo/jobs/ceiling-light.jpg
6853c3941014abdf9544af5ad9d7cf3849e9766e73278e74dcf2fb6734e5da31  public/demo/jobs/house-exterior.jpg
6805203feff5a66ba3fc3a32c2c639be957f36c8c3631160433e43ad8a7d23b9  public/demo/jobs/roof-tiles.jpg
7a88baea7f0a69d4b50e9fb44769207eaee3d8722763abdc2a5a01223ca9742b  public/demo/jobs/garden-shed.jpg
e292e66e25e1637b95868a685e37b1b5d566c5c91820d30e8a2de828e017e168  public/demo/jobs/deck-patio.jpg
4155de5ed8724efe250c182b44b023b5706cf7616a6faa15f967c149a0fd7f72  public/demo/jobs/room-renovation.jpg
```

## Fixture coverage

`prisma/seed.ts` preserves the original job IDs `demo-job-1001` through `demo-job-1006` and now gives those jobs varied stock-photo sets. It invokes `prisma/demo-jobs.ts` to add 20 explicitly synthetic fixtures with reserved stable IDs `demo-job-1101` through `demo-job-1120`. No extra users are created. Across all 26 fixtures there are 12 REVIEW, 3 PRICED, 3 BOOKABLE, 3 ASSIGNED, 1 SUBMITTED, 2 COMPLETED, 1 CANCEL_REVIEW and 1 CANCELLED jobs.

The additions cover Electrical, Plumbing, Gas Fitting and Construction. Plumbing, Gas Fitting and Construction remain REVIEW because their verification and completion requirements are pending in the existing product. No readiness or business guard is changed. Electrical jobs include small repairs, lighting, sensors, appliance points, outbuildings, a cancellation, submitted work and completed work. Existing `priceWork` calculates all priced additions from the saved settings, including the minimum labour charge; the small extra-work fixture explicitly prices incremental hours without another job minimum. Rates are frozen onto each priced job.

PRICED fixtures have pending job-payment records. Paid and later fixtures have matching paid job-payment records, keeping customer receipt screens usable. The new SUBMITTED/COMPLETED electrical fixtures use only the clearly labelled sample document below; the new completed job also has a payout and an explicitly demo review. Assigned fixtures include varied fictional messages, and one has priced extra work awaiting customer approval. Photo sets vary by scope; variation photos retain their job relation.

The SUBMITTED example's sample-document timestamp is at most one hour old and within half the configured automatic-release window, so normal page-load processing preserves the customer review stage after initialization. The COMPLETED example retains its historical document timestamp.

The new electrical REVIEW IDs `1101`, `1116` and `1120` are available for local illustrative quote-ETA presentation. Such ETAs are demo presentation, not a promise of real quote timing.

**The existing seed wipes its target database.** Its hosted nonempty-database refusal and normal initialization flow are preserved. This asset/fixture work did not run the seed, change a database, or change authentication. Run the seed only through the existing isolated disposable-demo setup, never against a database with data to preserve.

## Existing source originals and document fixture

The prior `/demo/wiring-demo.svg` and `/demo/pipework-demo.svg` wrappers remain available for legacy references. They embed unchanged JPEG bytes recovered from the user-provided original Trade Marketplace Figma archive `WurSo76mY67lO23D4Zlu7v` and visibly label themselves as demo illustrations. They are no longer attached to every seeded job. Original source files remain unchanged:

```text
8887b6bab309de9dc0ccb971b208772a2f70dd6cd568d42d478c477948aef438  public/original/browse-a8864402f9646efcef595fe0ee2677d285589ea3.jpg
3dc838bc94a38f5129de648742874511514509feef988536800b9828cc578d6a  public/original/browse-7905217e5451f25e95c4bbe9aca6b4d14008dafb.jpg
```

`/demo/not-a-certificate.pdf` is an authored one-page demonstration document using standard Helvetica, a large DEMO ONLY watermark and an explicit NOT A CERTIFICATE heading. It contains no signature, licence, inspection, approval or compliance claim. Seeded CoC identifiers start with `DEMO-NOT-A-CERTIFICATE`. This PDF exercises document viewing and is not a legal certificate.
