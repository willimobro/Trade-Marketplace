# QA loop

Four agents, defined in `.claude/agents/`:

| Agent | Does |
|---|---|
| `tradie-tester` | uses the site as a sparky (on 127.0.0.1:3123), writes `qa/round-N/tradie.md` |
| `customer-tester` | uses the site as a homeowner (on localhost:3123), writes `qa/round-N/customer.md` |
| `ux-designer` | turns complaints into a fix spec, `qa/round-N/ux-spec.md` |
| `coder` | implements the spec, type-checks, commits, `qa/round-N/coder-notes.md` |

Each round: `npm run db:seed` (fresh demo data) → both testers in parallel → designer → coder → next round.
Stops when both testers return `VERDICT: NO_COMPLAINTS` (or after 6 rounds).

The two testers use different hostnames so their login cookies don't clash in the same Chrome.
