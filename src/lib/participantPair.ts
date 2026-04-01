/** Stable pair key for DirectThread: lexicographic order on user ids. */
export function orderedParticipantIds(a: string, b: string): { low: string; high: string } {
  return a < b ? { low: a, high: b } : { low: b, high: a };
}
