/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('logo')
    .addColumn('team', 'text', (col) => col.primaryKey())
    .addColumn('logo', 'blob', (col) => col.notNull())
    .execute();
}

// export async function down(db: Kysely<any>): Promise<void> {
//   // Migration code
//   // nah
// }
