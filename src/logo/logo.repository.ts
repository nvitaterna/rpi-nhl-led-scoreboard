import { Db } from '../db/database';
import { LogoData } from './logo.schema';

export class LogoRepository {
  constructor(private db: Db) {}

  async get(team: string) {
    return this.db
      .selectFrom('logo')
      .selectAll()
      .where('team', '=', team)
      .executeTakeFirst();
  }

  async upsertMany(logos: LogoData[]) {
    await Promise.all(
      logos.map(async (logo) => {
        await this.db
          .insertInto('logo')
          .values(logo)
          .onConflict((b) => b.doUpdateSet(logo))
          .execute();
      }),
    );
  }
}
