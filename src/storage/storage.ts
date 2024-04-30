import storage from 'node-persist';
import path from 'path';

const CONFIG_PATH = path.join('__dirname', '../data');

export async function initStorage() {
  await storage.init({
    dir: CONFIG_PATH,
  });

  return storage;
}
