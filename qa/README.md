# QA loop

Three people do ONE real job together through the site, then two agents fix what got in their way.
Definitions in `.claude/agents/` (shared rules: `JOB_PROTOCOL.md`).

| Agent | Plays / does | Host |
|---|---|---|
| `customer-tester` | Sharon, homeowner — posts the job, pays, approves extras, confirms | localhost:3123 |
| `tradie-tester` | Jack, sparky — estimates, claims, "goes to site", variation, CoC | 127.0.0.1:3123 |
| `tm-office` | TM admin — prices job + variations, checks CoC, payouts | office.localhost:3123 |
| `ux-designer` | turns their reports into a fix spec, `qa/round-N/ux-spec.md` | |
| `coder` | builds the spec, type-checks, commits, `qa/round-N/coder-notes.md` | |

The three players run at the same time and hand over through `qa/round-N/job-log.md` (`HANDOFF -> <role>` lines).
Each writes a report of the friction working together. Each round: `npm run db:seed` → players → designer → coder.
Stops when all three return `VERDICT: NO_COMPLAINTS` (or after 6 rounds).
