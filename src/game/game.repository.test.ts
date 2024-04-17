import { describe, expect, it, vi } from 'vitest';
import { GameRepository } from './game.repository';
import { Db } from '../db/database';
import { Game } from './game.table';

const games: Game[] = [
  {
    id: 1,
    homeTeam: 'TOR',
    awayTeam: 'MTL',
    startTimeUtc: 123456,
    type: 'REGULAR',
  },
  {
    id: 2,
    homeTeam: 'VAN',
    awayTeam: 'EDM',
    startTimeUtc: 123456,
    type: 'REGULAR',
  },
  {
    id: 3,
    homeTeam: 'TOR',
    awayTeam: 'VAN',
    startTimeUtc: 123456,
    type: 'REGULAR',
  },
];

const mockedDb = {
  selectFrom: () => mockedDb,
  selectAll: () => mockedDb,
  where: () => mockedDb,
  executeTakeFirst: () => games[0],
  execute: () => games,
  insertInto: () => mockedDb,
  values: () => mockedDb,
  onConflict: () => mockedDb,
  doUpdateSet: () => mockedDb,
};

vi.spyOn(mockedDb, 'selectFrom');
vi.spyOn(mockedDb, 'where');
vi.spyOn(mockedDb, 'values');
vi.spyOn(mockedDb, 'insertInto');
vi.spyOn(mockedDb, 'onConflict');
vi.spyOn(mockedDb, 'execute');
vi.spyOn(mockedDb, 'executeTakeFirst');

describe('game.repository', () => {
  const gameRepository = new GameRepository(mockedDb as unknown as Db);
  it('should get a game', async () => {
    const game = await gameRepository.get(1);

    expect(mockedDb.selectFrom).toHaveBeenCalledWith('game');
    expect(mockedDb.where).toHaveBeenCalledWith('id', '=', 1);
    expect(mockedDb.executeTakeFirst).toHaveBeenCalled();
    expect(game).toEqual(games[0]);
  });

  it('should get all games for the given team', async () => {
    const allGames = await gameRepository.findByTeam('TOR');

    expect(mockedDb.selectFrom).toHaveBeenCalledWith('game');
    expect(mockedDb.execute).toHaveBeenCalled();
    expect(allGames).toEqual(games);
  });

  it('should upsert many games', async () => {
    const game: Game = {
      id: 4,
      homeTeam: 'CGY',
      awayTeam: 'EDM',
      startTimeUtc: 123456,
      type: 'REGULAR',
    };

    await gameRepository.upsertMany([game]);

    expect(mockedDb.insertInto).toHaveBeenCalledWith('game');
    expect(mockedDb.values).toHaveBeenCalledWith(game);
    expect(mockedDb.onConflict).toHaveBeenCalled();
    expect(mockedDb.execute).toHaveBeenCalled();
  });
});
