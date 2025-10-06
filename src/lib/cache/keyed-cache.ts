import { Cache } from './cache.js';

export class KeyedCache<T, Key = string> {
  private cache: Map<Key, Cache<T>> = new Map();

  constructor(
    private readonly ttl: number,
    private readonly fetchFunction: (key: Key) => Promise<T>,
  ) {}

  async get(key: Key): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!.get();
    }

    const newCache = new Cache<T>(this.ttl, () => this.fetchFunction(key));

    this.cache.set(key, newCache);

    return newCache.get();
  }
}
