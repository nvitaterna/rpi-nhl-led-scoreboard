import { ColumnType, Selectable } from 'kysely';

export interface LogoTable {
  team: ColumnType<string, string, never>;

  logo: ColumnType<Buffer, Buffer, never>;
}

export type Logo = Selectable<LogoTable>;
