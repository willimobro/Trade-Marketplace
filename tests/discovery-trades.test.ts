import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as readiness from "../src/lib/trade-readiness";
import * as constants from "../src/lib/constants";
import type { DiscoveryJob } from "../src/components/discovery/JobDiscovery";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/components/discovery/JobDiscovery.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exports: { JobDiscovery?: ComponentType<{ jobs: DiscoveryJob[]; defaultRegion: string; storageScope: string }> } = {};
const mocks: Record<string, unknown> = {
  "next/link": { default: (props: Record<string, unknown>) => createElement("a", props) },
  "@/lib/trade-readiness": readiness,
  "@/lib/constants": constants,
  "@/app/jobs/jobs.module.css": { default: {} },
};
runInNewContext(compiled, { exports, require: (name: string) => name in mocks ? mocks[name] : require(name) });
function card(category: string, status: string, distanceKm?: number) {
  const html = renderToStaticMarkup(createElement(exports.JobDiscovery!, {
    defaultRegion: "", storageScope: "test", jobs: [{ id: "test", jobNumber: 1001, title: "Sample", description: "Example", category, region: "Southland", suburb: "Example", status, distanceKm, detail: "Trade requirements pending. Estimating and claiming unavailable.", payAmount: status === "BOOKABLE" ? "$100.00" : undefined }],
  }));
  return html.match(/<article[\s\S]*?<\/article>/)![0];
}
test("pending trade cards never advertise estimates or claim availability, including legacy paid jobs", () => {
  for (const category of ["Plumbing", "Gas Fitting", "Construction", "Unknown"]) {
    for (const status of ["REVIEW", "BOOKABLE"]) {
      const html = card(category, status);
      assert.match(html, /aria-label="Sample\. Example, Southland\. Requirements pending/);
      assert.match(html, />Pay pending</);
      assert.doesNotMatch(html, />Requirements pending</);
      assert.doesNotMatch(html, /Available to claim|Needs estimates|Gross pay/);
    }
  }
});
test("configured electrical trade retains the existing card stage and pay labels", () => {
  assert.match(card("Electrical", "REVIEW"), /aria-label="[^"]*Needs estimates/);
  const paid = card("Electrical", "BOOKABLE");
  assert.match(paid, /aria-label="[^"]*Available to claim/);
  assert.match(paid, /Gross pay/);
});

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
test("cards display only title, real pay or pending pay, and truthful distance", () => {
  assert.equal(visibleText(card("Electrical", "BOOKABLE")), "Sample $100.00 Distance unavailable");
  assert.equal(visibleText(card("Electrical", "REVIEW")), "Sample Pay pending Distance unavailable");
  assert.equal(visibleText(card("Plumbing", "BOOKABLE")), "Sample Pay pending Distance unavailable");
  for (const invalid of [-1, NaN, Infinity]) assert.match(visibleText(card("Electrical", "BOOKABLE", invalid)), /Distance unavailable$/);
  assert.equal(visibleText(card("Electrical", "BOOKABLE", 2.34)), "Sample $100.00 2.3 km");
  assert.equal(visibleText(card("Electrical", "BOOKABLE", 0)), "Sample $100.00 0 km");
});
test("minimal cards preserve keyboard detail links and named independent save controls", () => {
  const html = card("Electrical", "BOOKABLE");
  assert.match(html, /href="\/jobs\/test"/);
  assert.match(html, /aria-label="Sample\. Example, Southland\. Available to claim\. Gross pay \$100\.00 before PAYE/);
  assert.match(html, /<button[^>]*aria-pressed="false"[^>]*aria-label="Save Sample"/);
  assert.match(html, /<\/a>\s*<button/);
});
