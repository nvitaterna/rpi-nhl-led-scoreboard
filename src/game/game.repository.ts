import { Db } from '@/db/database';
import { Game } from './game.table';

export class GameRepository {
  constructor(private db: Db) {}

  async get(id: number) {
    return this.db
      .selectFrom('game')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async findByTeam(abbrev: string) {
    return this.db
      .selectFrom('game')
      .selectAll()
      .where((eb) => eb('awayTeam', '=', abbrev).or('homeTeam', '=', abbrev))
      .execute();
  }

  async upsertMany(games: Game[]) {
    await Promise.all(
      games.map(async (game) => {
        await this.db
          .insertInto('game')
          .values(game)
          .onConflict((b) => b.doUpdateSet(game))
          .execute();
      }),
    );
  }
}
