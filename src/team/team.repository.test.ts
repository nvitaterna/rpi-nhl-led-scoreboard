import { describe, expect, it, vi } from 'vitest';
import { TeamRepository } from './team.repository';
import { Db } from '../db/database';

const teams = [
  {
    abbrev: 'TOR',
    name: 'Toronto Maple Leafs',
    logoUrl: 'TOR',
  },
  {
    abbrev: 'MTL',
    name: 'Montreal Canadiens',
    logoUrl: 'MTL',
  },
  {
    abbrev: 'VAN',
    name: 'Vancouver Canucks',
    logoUrl: 'VAN',
  },
];

const mockedDb = {
  selectFrom: () => mockedDb,
  selectAll: () => mockedDb,
  where: () => mockedDb,
  executeTakeFirst: () => teams[0],
  execute: () => teams,
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

describe('team.repository', () => {
  const teamRepository = new TeamRepository(mockedDb as unknown as Db);
  it('should get a team', async () => {
    const team = await teamRepository.get('TOR');

    expect(mockedDb.selectFrom).toHaveBeenCalledWith('team');
    expect(mockedDb.where).toHaveBeenCalledWith('abbrev', '=', 'TOR');
    expect(mockedDb.executeTakeFirst).toHaveBeenCalled();
    expect(team).toEqual(teams[0]);
  });

  it('should get all teams', async () => {
    const allTeams = await teamRepository.getAll();

    expect(mockedDb.selectFrom).toHaveBeenCalledWith('team');
    expect(mockedDb.execute).toHaveBeenCalled();
    expect(allTeams).toEqual(teams);
  });

  it('should upsert many teams', async () => {
    const team = {
      abbrev: 'CGY',
      name: 'Calgary Flames',
      logoUrl: 'CGY',
    };

    await teamRepository.upsertMany([team]);

    expect(mockedDb.insertInto).toHaveBeenCalledWith('team');
    expect(mockedDb.values).toHaveBeenCalledWith(team);
    expect(mockedDb.onConflict).toHaveBeenCalled();
    expect(mockedDb.execute).toHaveBeenCalled();
  });
});
