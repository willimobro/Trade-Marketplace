/** Stable grouping: retain the chosen order within active and completed jobs. */
export function activeJobsFirst<T>(items: readonly T[], isComplete: (item: T) => boolean): T[] {
  return [...items.filter((item) => !isComplete(item)), ...items.filter(isComplete)];
}
