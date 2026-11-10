/**
 * Database Circuit Breaker & Safe Query Utility
 * Prevents requests from hanging for 10+ seconds when remote DB (Neon) is unreachable or cold.
 */

let isDbDown = false;
let dbDownUntil = 0;
const DOWNTIME_COOLDOWN_MS = 30000; // 30 seconds cooldown before trying remote DB again

export function isDatabaseAvailable(): boolean {
  if (!isDbDown) return true;
  if (Date.now() > dbDownUntil) {
    // Cooldown expired, allow next request to attempt connection
    isDbDown = false;
    return true;
  }
  return false;
}

export function markDatabaseDown() {
  isDbDown = true;
  dbDownUntil = Date.now() + DOWNTIME_COOLDOWN_MS;
}

export function markDatabaseUp() {
  isDbDown = false;
  dbDownUntil = 0;
}

/**
 * Execute a Prisma query with a strict sub-second timeout and circuit breaker.
 * If DB is unreachable or times out, returns the fallback value immediately without throwing.
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  timeoutMs: number = 1000
): Promise<T> {
  if (!isDatabaseAvailable()) {
    return fallback;
  }

  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('DATABASE_TIMEOUT'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([queryFn(), timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    markDatabaseUp();
    return result;
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    markDatabaseDown();
    // Silently return fallback without flooding console
    return fallback;
  }
}
