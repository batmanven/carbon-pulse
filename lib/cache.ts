export class AICache<T = unknown> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private readonly TTL_MS: number;

  constructor(ttlMs = 3600_000) {
    this.TTL_MS = ttlMs;
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
      return;
    }
    const cleanup = setInterval(() => this.evictStale(), 600_000);
    if (cleanup.unref) cleanup.unref();
  }

  private evictStale(): void {
    const cutoff = Date.now() - this.TTL_MS;
    for (const [key, entry] of this.cache) {
      if (entry.timestamp < cutoff) this.cache.delete(key);
    }
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  generateKey(prefix: string, body: Record<string, unknown>): string {
    return prefix + "_" + JSON.stringify(body);
  }
}

export const aiCache = new AICache();
