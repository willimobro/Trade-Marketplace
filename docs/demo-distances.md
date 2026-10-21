# Prototype distances

The six synthetic seed jobs use reserved IDs `demo-job-1001` through `demo-job-1006`. Their illustrative kilometre values live in `src/lib/demo-distances.ts`. They are returned only in explicitly enabled local demo or hosted preview mode. Ordinary created listings retain generated IDs and never receive invented distances, even inside the demo.

Both browse and all-jobs cards accept an optional numeric `distanceKm` and share `formatDistanceKm`. A future location adapter can supply actual calculated values through the same property without changing card layout. The fixture values are not calculated geolocation.

New disposable seeded previews receive these IDs. No existing database is reset or migrated by this patch. Older fixtures with random IDs intentionally retain unavailable distance; test this change using a fresh isolated synthetic database. Never run the destructive development seed against an existing user database.
