import { describe, expect, it, vi } from 'vitest';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { db } from '../db/database';
import { NhlApi } from '../nhl-api/nhl-api';
import { Team } from './team.table';

const teams: Team[] = [
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

vi.mock('../db/database', () => {
  const db = {
    selectFrom: () => db,
    selectAll: () => db,
    where: () => db,
    executeTakeFirst: () => teams[0],
    execute: () => teams,
    insertInto: () => db,
    values: () => db,
    onConflict: () => db,
    doUpdateSet: () => db,
  };

  return { db };
});

vi.mock('./team.repository', () => {
  const TeamRepository = vi.fn();
  TeamRepository.prototype.getTeam = vi.fn();
  TeamRepository.prototype.getAllTeams = vi.fn();
  TeamRepository.prototype.upsertMany = vi.fn();

  return { TeamRepository };
});

vi.mock('../nhl-api/nhl-api', () => {
  const NhlApi = vi.fn();
  NhlApi.prototype.fetchTeams = vi.fn();

  return { NhlApi };
});

describe('team.service', () => {
  const teamRepository = new TeamRepository(db);
  const nhlApi = new NhlApi();
  const teamService = new TeamService(teamRepository, nhlApi);

  it('should get a team', async () => {
    vi.spyOn(teamRepository, 'getTeam').mockResolvedValue(teams[0]);
    const team = await teamService.get('TOR');

    expect(teamRepository.get).toHaveBeenCalledWith('TOR');
    expect(team).toEqual(teams[0]);
  });

  it('should get all teams', async () => {
    vi.spyOn(teamRepository, 'getAllTeams').mockResolvedValue(teams);
    const allTeams = await teamService.getAll();

    expect(teamRepository.getAll).toHaveBeenCalled();
    expect(allTeams).toEqual(teams);
  });

  it('should bootstrap teams', async () => {
    vi.spyOn(nhlApi, 'fetchTeams').mockResolvedValue(teams);
    await teamService.bootstrap();

    expect(nhlApi.fetchTeams).toHaveBeenCalled();
    expect(teamRepository.upsertMany).toHaveBeenCalledWith(teams);
  });
});
