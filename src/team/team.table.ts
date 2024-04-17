import { ColumnType, Selectable } from 'kysely';

export interface TeamTable {
  abbrev: ColumnType<string, string, never>;

  name: ColumnType<string, string, never>;

  logoUrl: ColumnType<string, string, never>;
}

export type Team = Selectable<TeamTable>;
