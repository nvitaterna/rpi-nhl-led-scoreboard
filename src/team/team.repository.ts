import { Db } from '../db/database';
import { Team } from './team.table';

export class TeamRepository {
  constructor(private db: Db) {}

  async get(abbrev: string) {
    return await this.db
      .selectFrom('team')
      .selectAll()
      .where('abbrev', '=', abbrev)
      .executeTakeFirst();
  }

  async getAll() {
    return await this.db.selectFrom('team').selectAll().execute();
  }

  async upsertMany(teams: Team[]) {
    await Promise.all(
      teams.map(async (team) => {
        await this.db
          .insertInto('team')
          .values(team)
          .onConflict((b) => b.doUpdateSet(team))
          .execute();
      }),
    );
  }
}
