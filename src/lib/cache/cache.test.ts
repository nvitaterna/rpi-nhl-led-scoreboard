import { describe, expect, it, vi } from 'vitest';

import { Cache } from './cache.js';

describe('Cache', () => {
  describe('get', () => {
    it('should return cached data if within TTL', async () => {
      const fetchFunction = vi.fn(async () => {
        return true;
      });

      const cache = new Cache(1000, fetchFunction);

      const result = await cache.get();
      const result2 = await cache.get();

      expect(fetchFunction).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      expect(result2).toBe(true);
    });

    it('should refetch data if TTL has expired', async () => {
      let lastFetch = true;

      const fetchFunction = vi.fn(async () => {
        return lastFetch;
      });

      const cache = new Cache(100, fetchFunction);

      const result = await cache.get();

      // Wait for TTL to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      lastFetch = false;

      const result2 = await cache.get();

      expect(fetchFunction).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
      expect(result2).toBe(false);
    });
  });
});
