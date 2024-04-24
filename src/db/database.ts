import { Kysely, SqliteDialect } from 'kysely';
import { TeamTable } from '@/team/team.table';
import SQLite from 'better-sqlite3';
import { GameTable } from '@/game/game.table';
import path from 'path';
import { LogoTable } from '@/logo/logo.table';

export interface Database {
  team: TeamTable;
  game: GameTable;
  logo: LogoTable;
}

const dialect = new SqliteDialect({
  database: new SQLite(path.join(__dirname, '../../data', 'nhl.db')),
});

export const db = new Kysely<Database>({ dialect });

export type Db = typeof db;
