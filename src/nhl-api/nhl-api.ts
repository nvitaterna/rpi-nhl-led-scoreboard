import { StandingsResponse } from './types/standings-response';
import { BoxScoreResponse } from './types/boxscore-response';
import { ScheduleResponse } from './types/schedule-response';
import { GameType, gameSchema } from '@/game/game.schema';
import { TeamData, teamSchema } from '@/team/team.schema';
import { BoxscoreData, boxscoreSchema } from '@/boxscore/boxscore.schema';
import { LoggerService } from '@/logger/logger.service';
import { Logger } from 'pino';
import { GameState } from './types/game-state';

const NHL_API_BASE_URL = 'https://api-web.nhle.com/v1';

export class NhlApi {
  private baseUrl = NHL_API_BASE_URL;

  private logger: Logger;

  constructor(loggerService: LoggerService) {
    this.logger = loggerService.child('nhl-api');
  }

  async fetchTeams(): Promise<TeamData[]> {
    const response = await fetch(`${this.baseUrl}/standings/now`);

    if (response.status >= 400) {
      this.logger.error(await response.text());
      throw new Error('Bad response from server for fetchTeams.');
    }

    const data = (await response.json()) as StandingsResponse;

    return data.standings.map((team) => {
      return teamSchema.parse({
        abbrev: team.teamAbbrev.default,
        name: team.teamName.default,
        logoUrl: team.teamLogo,
      });
    });
  }

  async fetchGames(teamAbbrev: string) {
    const response = await fetch(
      `${this.baseUrl}/club-schedule-season/${teamAbbrev}/now`,
    );

    if (response.status >= 400) {
      this.logger.error(await response.text());
      throw new Error('Bad response from server for fetchGames.');
    }

    const data = (await response.json()) as ScheduleResponse;

    return data.games.map((game) => {
      return gameSchema.parse({
        id: game.id,
        startTimeUtc: this.parseStartTimeUtc(game.startTimeUTC),
        awayTeam: game.awayTeam.abbrev,
        homeTeam: game.homeTeam.abbrev,
        type: this.parseGameType(game.gameType),
      });
    });
  }

  async fetchBoxscore(gameId: number) {
    const response = await fetch(
      `${this.baseUrl}/gamecenter/${gameId}/boxscore`,
    );

    if (response.status >= 400) {
      this.logger.error(await response.text());
      throw new Error('Bad response from server for fetchBoxscore.');
    }

    const game = (await response.json()) as BoxScoreResponse;

    return boxscoreSchema.parse({
      id: game.id,
      startTimeUtc: this.parseStartTimeUtc(game.startTimeUTC),
      awayTeam: game.awayTeam.abbrev,
      homeTeam: game.homeTeam.abbrev,
      type: this.parseGameType(game.gameType),
      status: this.parseGameState(game.gameState),
      awayScore: game.awayTeam.score,
      homeScore: game.homeTeam.score,
      period: game.periodDescriptor?.number,
      periodType: this.parsePeriodType(game.periodDescriptor?.periodType),
      minutes: this.parseTimeRemaining(game.clock?.timeRemaining).minutes,
      seconds: this.parseTimeRemaining(game.clock?.timeRemaining).seconds,
    });
  }

  private parseStartTimeUtc(date: string) {
    return new Date(date).getTime();
  }

  private parseGameType(type: number): GameType {
    switch (type) {
      case 1:
        return 'PRESEASON';
      case 2:
        return 'REGULAR';
      case 3:
        return 'PLAYOFF';
      default:
        this.logger.error('Unknown game type:', type);
        return 'REGULAR';
    }
  }

  private parseGameState(rawGameState?: GameState): BoxscoreData['status'] {
    if (!rawGameState) {
      return null;
    }
    let status: BoxscoreData['status'];

    switch (rawGameState) {
      case 'LIVE':
      case 'CRIT':
        status = 'LIVE';
        break;
      case 'FINAL':
      case 'OFF':
        status = 'FINAL';
        break;
      case 'FUT':
      case 'PRE':
        status = 'UPCOMING';
        break;
      default:
        status = 'UPCOMING';
        this.logger.error('Unknown game state', rawGameState);
        break;
    }

    return status;
  }

  private parsePeriodType(rawPeriodType?: string): BoxscoreData['periodType'] {
    if (!rawPeriodType) {
      return null;
    }

    let periodType: BoxscoreData['periodType'];

    switch (rawPeriodType) {
      case 'REG':
        periodType = 'REGULAR';
        break;
      case 'OT':
        periodType = 'OVERTIME';
        break;
      case 'SO':
        periodType = 'SHOOTOUT';
        break;
      default:
        periodType = 'REGULAR';
        this.logger.error('Unknown period type', rawPeriodType);
        break;
    }

    return periodType;
  }

  parseTimeRemaining(timeRemaining?: string) {
    if (!timeRemaining) {
      return { minutes: null, seconds: null };
    }
    const [minutes, seconds] = timeRemaining.split(':').map(Number);

    return { minutes, seconds };
  }
}
