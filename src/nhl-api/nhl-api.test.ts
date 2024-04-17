import { expect, describe, it, expectTypeOf } from 'vitest';
import { BoxscoreData, GameData, TeamData, nhlApi } from './nhl-api';

describe('nhl-api', () => {
  it('should fetch a lits of teams', async () => {
    const teams = await nhlApi.fetchTeams();

    expect(teams).toHaveLength(32);

    expectTypeOf(teams).toEqualTypeOf<TeamData[]>();
  });

  it('should fetch a list of games', async () => {
    const team = 'TOR';

    const games = await nhlApi.fetchGames(team);

    expectTypeOf(games).toEqualTypeOf<GameData[]>();
  });

  it('should fetch a boxscore', async () => {
    const gameId = 2023021260;

    const boxscore = await nhlApi.fetchBoxscore(gameId);

    expectTypeOf(boxscore).toEqualTypeOf<BoxscoreData>();
  });
});
