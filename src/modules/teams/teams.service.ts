import {
  isAfter,
  isBefore,
  compareAsc,
  compareDesc,
  differenceInHours,
} from 'date-fns';

import type { Logger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';
import type { StandingsEntry } from '@/lib/nhl-api/standings/standings.schema.js';

import { GamesService } from '../games/games.service.js';

export type Team = {
  /**
   * The team Abbreviation (e.g. "NYR" for New York Rangers)
   */
  id: string;
  conference: StandingsEntry['conferenceName'];
  divisionName: StandingsEntry['divisionName'];
  placeName: string;
  teamName: string;
  fullName: string;
  logoUrl: string;
};

export class TeamsService {
  private teams: Team[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly nhlApi: NhlApi,
    private readonly gamesService: GamesService,
  ) {}

  private async fetchTeams() {
    this.logger.debug('Getting teams from NHL standings API.');

    const standings = await this.nhlApi.getStandings();

    this.teams = standings.standings.map((entry) => ({
      id: entry.teamAbbrev.default,
      conference: entry.conferenceName,
      divisionName: entry.divisionName,
      placeName: entry.placeName.default,
      teamName: entry.teamName.default,
      fullName: entry.teamCommonName.default,
      logoUrl: entry.teamLogo,
    }));

    this.logger.debug(`Fetched ${this.teams.length} teams from NHL API.`);

    return this.teams;
  }

  async getTeams() {
    return this.fetchTeams();
  }

  async getActiveGameForTeam(abbrev: string) {
    const games = await this.gamesService.getGames(abbrev);

    const sortedAscGames = games.sort((a, b) =>
      compareAsc(a.gameStart, b.gameStart),
    );

    const now = new Date();

    // find the first game that is in the future
    const nextGame = sortedAscGames.find((game) =>
      isAfter(game.gameStart, now),
    );

    const sortedDescGames = games.sort((a, b) =>
      compareDesc(a.gameStart, b.gameStart),
    );

    // find the first game that is in the past
    const lastGame = sortedDescGames.find((game) =>
      isBefore(game.gameStart, now),
    );

    if (lastGame) {
      if (lastGame.gameState === 'inProgress') {
        return lastGame;
      }

      // if last game was within the last 10 hours, return it
      if (lastGame && differenceInHours(now, lastGame.gameStart) <= 10) {
        return lastGame;
      }
    } else {
      this.logger.debug(`No last game found for team ${abbrev}.`);
    }

    if (nextGame) {
      return nextGame;
    } else {
      this.logger.debug(`No next game found for team ${abbrev}.}`);
    }

    return null;
  }
}
