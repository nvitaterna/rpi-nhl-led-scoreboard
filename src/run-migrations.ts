import { FileMigrationProvider, Migrator } from 'kysely';
import { db } from './db/database';
import fs from 'fs/promises';
import path from 'path';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, './migrations'),
  }),
});

export const migrate = async () => {
  await migrator.migrateToLatest();
};
