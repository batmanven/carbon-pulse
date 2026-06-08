export class AICache<T = unknown> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private readonly TTL_MS = 1000 * 60 * 60;

  public get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public set(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  public generateKey(prefix: string, body: Record<string, unknown>): string {
    return prefix + "_" + JSON.stringify(body);
  }
}

export const aiCache = new AICache();
