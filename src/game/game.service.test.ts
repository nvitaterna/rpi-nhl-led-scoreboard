import { describe, expect, it, vi } from 'vitest';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { db } from '../db/database';
import { NhlApi } from '../nhl-api/nhl-api';
import { Game } from './game.table';
import { TeamRepository } from '../team/team.repository';

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

vi.mock('../db/database', () => {
  const db = {
    selectFrom: () => db,
    selectAll: () => db,
    where: () => db,
    executeTakeFirst: () => games[0],
    execute: () => games,
    insertInto: () => db,
    values: () => db,
    onConflict: () => db,
    doUpdateSet: () => db,
  };

  return { db };
});

vi.mock('./game.repository', () => {
  const GameRepository = vi.fn();
  GameRepository.prototype.getGame = vi.fn();
  GameRepository.prototype.findGamesByTeam = vi.fn();
  GameRepository.prototype.upsertMany = vi.fn();

  return { GameRepository };
});

vi.mock('../team/team.repository', () => {
  const TeamRepository = vi.fn();
  TeamRepository.prototype.getAllTeams = vi.fn();

  return { TeamRepository };
});

vi.mock('../nhl-api/nhl-api', () => {
  const NhlApi = vi.fn();
  NhlApi.prototype.fetchGames = vi.fn();

  return { NhlApi };
});

describe('game.service', () => {
  const gameRepository = new GameRepository(db);
  const teamRepository = new TeamRepository(db);
  const nhlApi = new NhlApi();
  const gameService = new GameService(gameRepository, teamRepository, nhlApi);

  it('should get a game', async () => {
    vi.spyOn(gameRepository, 'getGame').mockResolvedValue(games[0]);
    const game = await gameService.get(1);

    expect(gameRepository.get).toHaveBeenCalledWith(1);
    expect(game).toEqual(games[0]);
  });

  it('should find games by team', async () => {
    vi.spyOn(gameRepository, 'findGamesByTeam').mockResolvedValue(
      games.filter((g) => g.homeTeam === 'TOR' || g.awayTeam === 'TOR'),
    );

    const team = 'TOR';
    const teamGames = await gameService.findByTeam(team);

    expect(gameRepository.findByTeam).toHaveBeenCalledWith(team);
    expect(teamGames).toEqual(
      games.filter((g) => g.homeTeam === team || g.awayTeam === team),
    );
  });

  it('should bootstrap games', async () => {
    vi.spyOn(nhlApi, 'fetchGames').mockResolvedValue(games);
    vi.spyOn(teamRepository, 'getAllTeams').mockResolvedValue([
      { abbrev: 'TOR', name: 'Toronto Maple Leafs', logoUrl: 'TOR' },
      { abbrev: 'VAN', name: 'Vancouver Canucks', logoUrl: 'VAN' },
    ]);
    await gameService.bootstrap();

    expect(gameRepository.upsertMany).toHaveBeenCalledWith(games);
  });
});
