// Illustrative distances for reserved synthetic seed IDs only. No geolocation is implied.
// Edit this map to tune the prototype; real distance services can supply distanceKm later.
export const DEMO_JOB_DISTANCES_KM: Readonly<Record<string, number>> = Object.freeze({
  "demo-job-1001": 2.4,
  "demo-job-1002": 4.8,
  "demo-job-1003": 1.6,
  "demo-job-1004": 6.2,
  "demo-job-1005": 3.1,
  "demo-job-1006": 8.5,
});

export function demoDistanceKm(jobId: string, env: { TRADE_LOCAL_DEMO?: string; TRADE_HOSTED_PREVIEW?: string } = { TRADE_LOCAL_DEMO: process.env.TRADE_LOCAL_DEMO, TRADE_HOSTED_PREVIEW: process.env.TRADE_HOSTED_PREVIEW }): number | undefined {
  if (env.TRADE_LOCAL_DEMO !== "1" && env.TRADE_HOSTED_PREVIEW !== "1") return undefined;
  return Object.hasOwn(DEMO_JOB_DISTANCES_KM, jobId) ? DEMO_JOB_DISTANCES_KM[jobId] : undefined;
}
