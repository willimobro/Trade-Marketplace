# Local demo access

`/demo` is an opt-in convenience page for an isolated local runtime, outside the normal customer interface. Enable only that runtime with `TRADE_LOCAL_DEMO=1`, bind the server to loopback, and open `/demo` on `localhost`, `127.0.0.1`, or `[::1]` with an optional valid port. Missing/different flags or any other Host return not-found. Forwarded headers are never consulted. The gate runs both on rendering and on each action request.

Three buttons select the existing seeded customer, electrician and administrator accounts. Their credentials are supplied only inside the gated server action, which calls the existing normal `login` action. The client component receives no email/password props or embedded passwords. Password verification, cookies and authorization remain unchanged. Invalid credentials show the normal login error; this page does not seed data, create accounts, or create sessions directly.

Switching roles replaces the current session. The database must already contain the intended demo accounts. Use only a disposable local database and keep simulated-payment disclosures. This implementation did not start a runtime, run the destructive seed, or modify a database.

Do not enable this flag in a deployed/shared environment, expose this runtime through a tunnel/proxy, or treat Host validation as proof of a TCP peer address: HTTP clients can set Host. Binding to loopback and using an isolated local database are required operational boundaries. With the flag absent the page and helper action remain unavailable even on localhost. No demo credentials are rendered in an ungated page/client payload.

Gate cases are covered by `src/app/demo/gate.test.ts` (run directly with Node's tsx test loader). Normal authentication and the full UI remain integration-test responsibilities.

Runtime verification: all three role buttons reached their expected dashboard/admin routes. A nonlocal Host rendered Next.js not-found without role controls or credentials; because the response streams through the app layout, the outer HTTP status was200 with a not-found boundary. Do not treat the status alone as evidence of access.
