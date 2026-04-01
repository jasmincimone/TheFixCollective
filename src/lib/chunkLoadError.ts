/**
 * Detects webpack/Next lazy chunk failures (common in dev after HMR invalidates hashes).
 */
export function isChunkLoadError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.includes("Loading chunk") ||
    message.includes("ChunkLoadError") ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("Chunk load failed")
  );
}
