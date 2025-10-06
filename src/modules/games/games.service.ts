import type { Logger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';
import { GameType } from '@/lib/nhl-api/schedule/schedule.schemas.js';

import { type GameState, gameStateMapper } from './games.utils.js';

export type Game = {
  id: number;
  gameType: GameType;
  gameStart: Date;
  gameState: GameState;
  homeTeamAbbrev: string;
  awayTeamAbbrev: string;
};

export class GamesService {
  private games: Game[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly nhlApi: NhlApi,
  ) {}

  private async fetchGamesForTeam(teamAbbrev: string) {
    this.logger.debug(`Getting games for team ${teamAbbrev} from NHL API.`);

    const schedule = await this.nhlApi.getSchedule(teamAbbrev);

    this.games = schedule.games.map((game) => ({
      id: game.id,
      gameType: game.gameType,
      gameStart: new Date(game.startTimeUTC),
      gameState: gameStateMapper(game.gameState),
      homeTeamAbbrev: game.homeTeam.abbrev,
      awayTeamAbbrev: game.awayTeam.abbrev,
    }));

    return this.games;
  }

  async getGames(teamAbbrev: string) {
    return this.fetchGamesForTeam(teamAbbrev);
  }
}
