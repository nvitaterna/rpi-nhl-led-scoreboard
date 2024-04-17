/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('game')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('startTimeUtc', 'integer')
    .addColumn('awayTeam', 'text')
    .addColumn('homeTeam', 'text')
    .addColumn('type', 'text')
    .execute();
}

// export async function down(db: Kysely<any>): Promise<void> {
//   // Migration code
//   // nah
// }
