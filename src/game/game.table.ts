import { ColumnType, Selectable } from 'kysely';
import { GameType } from './game.schema';

export interface GameTable {
  id: ColumnType<number, number, never>;

  startTimeUtc: ColumnType<number, number, never>;

  homeTeam: ColumnType<string, string, never>;

  awayTeam: ColumnType<string, string, never>;

  type: ColumnType<GameType, GameType, never>;
}

export type Game = Selectable<GameTable>;
