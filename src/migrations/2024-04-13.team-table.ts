/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('team')
    .addColumn('abbrev', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('logoUrl', 'text', (col) => col.notNull())
    .execute();
}

// export async function down(db: Kysely<any>): Promise<void> {
//   // Migration code
//   // nah
// }
