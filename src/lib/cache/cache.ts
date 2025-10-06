export class Cache<T> {
  private data: T | null = null;
  private timestamp: number | null = null;

  constructor(
    private readonly ttl: number,
    private readonly fetchFunction: () => Promise<T>,
  ) {}

  async get(): Promise<T> {
    const now = Date.now();
    if (this.data && this.timestamp && now - this.timestamp < this.ttl) {
      return this.data;
    }
    this.data = await this.fetchFunction();
    this.timestamp = now;
    return this.data;
  }
}
