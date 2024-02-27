import {
  BoxScoreResponse,
  Clock,
  PeriodDescriptor,
} from '../../nhl-api/types/boxscore-response';
import { GameState } from '../../nhl-api/types/game-state';
import { ScheduleResponse } from '../../nhl-api/types/schedule-response';

export interface Game {
  id: number;
  gameDate: string;
  startTimeUTC: string;
  awayTeam: {
    abbrev: string;
  };
  homeTeam: {
    abbrev: string;
  };
}

export interface BoxScore {
  id: number;
  gameDate: string;
  startTimeUTC: string;
  gameState: GameState;
  periodDescriptor: PeriodDescriptor;
  awayTeam: {
    abbrev: string;
    score?: number;
  };
  homeTeam: {
    abbrev: string;
    score?: number;
  };
  clock: Clock;
}

export class NhlAPI {
  constructor(
    private readonly baseUrl: string = 'https://api-web.nhle.com/v1',
  ) {}

  /**
   *
   * @param teamAbbrev the 3 letter abbreviation for the team
   * @returns the full season schedule for the team excluding preseason games
   */
  async fetchSchedule(teamAbbrev: string): Promise<Game[]> {
    const response = await fetch(
      `${this.baseUrl}/club-schedule-season/${teamAbbrev}/now`,
    );

    if (response.status >= 400) {
      console.error(await response.text());
      throw new Error('Bad response from server for schedule');
    }

    const data = (await response.json()) as ScheduleResponse;

    // filter out preseason games (gametype = 1)
    const games = data.games.filter((game) => game.gameType === 2);

    return games.map((game) => ({
      id: game.id,
      gameDate: game.gameDate,
      startTimeUTC: game.startTimeUTC,
      awayTeam: {
        abbrev: game.awayTeam.abbrev,
      },
      homeTeam: {
        abbrev: game.homeTeam.abbrev,
      },
    }));
  }

  async fetchBoxScore(gameId: number): Promise<BoxScore> {
    const response = await fetch(
      `${this.baseUrl}/gamecenter/${gameId}/boxscore`,
    );

    if (response.status >= 400) {
      console.error(await response.text());
      throw new Error('Bad response from server for live game');
    }

    const data = (await response.json()) as BoxScoreResponse;

    return {
      id: data.id,
      gameDate: data.gameDate,
      startTimeUTC: data.startTimeUTC,
      gameState: data.gameState,
      periodDescriptor: data.periodDescriptor,
      awayTeam: {
        abbrev: data.awayTeam.abbrev,
        score: data.awayTeam.score,
      },
      homeTeam: {
        abbrev: data.homeTeam.abbrev,
        score: data.homeTeam.score,
      },
      clock: data.clock,
    };
  }
}
