# Shared job protocol (customer, tradie, TM office)

Three agents play ONE real electrical job together, start to finish, at the same time, each in their own Chrome tab
and on their own hostname (cookies are per host, so logins don't clash):

| Role | Host | Login |
|---|---|---|
| customer (Sharon) | http://localhost:3123 | `customer@demo.test` |
| tradie (Jack) | http://127.0.0.1:3123 | `sparky@demo.test` |
| TM office | http://willimo:3123 | `admin@demo.test` |

Passwords are in `prisma/seed.ts`. Load the Claude in Chrome tools in ONE ToolSearch call, create your OWN new tab,
never touch other tabs, never trigger alert/confirm dialogs, never visit any other site. Never edit source code.

## Act like it's real

This is not website testing. You are people doing a job together. Think about what each person actually needs at
every point in a real job: when is the sparky coming, will someone be home, how do they get in, where's the
switchboard, is there a dog, what did the sparky find, why is it costing more, is it safe, when's it finished, is
the money right, did the CoC come through. Do everything you'd really do — and when the site gives you no way to do
it (e.g. agree a time, tell them you're running late, ask a question before paying), that is exactly what to record.

The tradie plays the physical work too: say what you find on site (realistic NZ residential wiring — old fuse board,
no RCD, damaged cable, wrong cable size, asbestos backing, extra circuit needed…). Use any image on disk (e.g. in
`uploads/`) as your "photos".

## The shared log — how you hand over

All three of you append to `qa/round-<N>/job-log.md` (create it if missing). Append only, never rewrite. One entry:

```
[HH:MM] TRADIE: what I did / said / found (in character)
HANDOFF -> customer: what I need from them
```

Use `HANDOFF -> customer`, `HANDOFF -> tradie` or `HANDOFF -> office` whenever someone else must act. Also use the
site itself (its messages, uploads etc.) for anything the real people would do there — the log is just narration.

**Waiting:** when it's someone else's turn, wait for a new `HANDOFF -> <you>` line, e.g. in Bash:
`timeout 900 bash -c 'n=$(grep -c "HANDOFF -> tradie" LOG); until [ $(grep -c "HANDOFF -> tradie" LOG) -gt $n ]; do sleep 20; done'`
(count the existing lines first so you wait for a NEW one). While waiting, also check the site — a real person would
notice changes there. If you wait 15 minutes with nothing, log `STUCK: waiting for …` (that is a finding: how would
the real person have known what was happening?) and continue or finish.

When the job is fully done (CoC in, customer confirmed, review left, payout queued) or truly stuck, log `JOB OVER`.
Stop when you see `JOB OVER` and have written your report.

## Report — friction working together

Write `qa/round-<N>/<role>.md`:

```
# <Role> report — round N
VERDICT: COMPLAINTS | NO_COMPLAINTS
Job: one line on what the job was and how it went

## 1. <short title>   [blocker | major | minor]
Moment: what was happening in the job
Problem: what I needed to do / know and couldn't, or what went wrong between us (in character, 1–3 lines)
```

Complain about the job and working with the other people: missing information, no way to communicate or agree
something, waiting without knowing why, money surprises, trust, safety, paperwork. Not about button colours.
**No invented nitpicks** — if it worked like real life should, say nothing. Don't repeat complaints from earlier
rounds that are now fixed. Return a 2–3 line summary.
