import { afterAll, beforeAll } from 'vitest';
import { server } from './mocks/server';
import { afterEach } from 'node:test';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'warn',
  }),
);

afterAll(() => server.close());

afterEach(() => server.resetHandlers());
