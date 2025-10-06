import { createServer } from 'node:http';

import { config } from '@/lib/config/config.js';

const { port } = config;

const server = createServer();

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

export { server };
