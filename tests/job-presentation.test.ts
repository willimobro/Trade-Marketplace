import assert from "node:assert/strict";
import { test } from "node:test";
import { activeJobsFirst } from "../src/lib/job-presentation";

test("completed jobs follow all active jobs in both date orders without changing each group's order", () => {
  const jobs = [
    { id: "active-old", date: 1, status: "ASSIGNED" },
    { id: "done-old", date: 2, status: "COMPLETED" },
    { id: "active-new", date: 3, status: "PRICED" },
    { id: "done-new", date: 4, status: "COMPLETED" },
  ];
  const complete = (job: typeof jobs[number]) => job.status === "COMPLETED";
  for (const direction of [1, -1]) {
    const ordered = [...jobs].sort((a, b) => direction * (a.date - b.date));
    const result = activeJobsFirst(ordered, complete);
    assert.deepEqual(result.slice(0, 2), ordered.filter((job) => !complete(job)));
    assert.deepEqual(result.slice(2), ordered.filter(complete));
    assert.deepEqual(ordered.map((job) => job.date), direction === 1 ? [1, 2, 3, 4] : [4, 3, 2, 1]);
    assert.deepEqual(activeJobsFirst(ordered.filter(complete), complete), ordered.filter(complete));
  }
});
