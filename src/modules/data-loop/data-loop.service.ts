import type { Logger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';
import type { PeriodType } from '@/lib/nhl-api/nhl-api.schemas.js';
import type {
  PlayByPlayEvent,
  PlayByPlayPlayer,
} from '@/lib/nhl-api/play-by-play/play-by-play.schemas.js';
import type { GameType } from '@/lib/nhl-api/schedule/schedule.schemas.js';

import type { ActiveTeamService } from '../active-team/active-team.service.js';
import type { GameState } from '../games/games.utils.js';
import type { LogosService } from '../logos/logos.service.js';
import type { TeamsService } from '../teams/teams.service.js';

export type GameData = {
  id: number;
  startTime: Date;
  gameType: GameType;
  gameState: GameState;
  homeTeam: {
    id: number;
    abbrev: string;
    score?: number;
  };
  awayTeam: {
    id: number;
    abbrev: string;
    score?: number;
  };
  clock: {
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  period?: {
    number: number;
    type: PeriodType;
  };
  outcome?: PeriodType;
  events: PlayByPlayEvent[];
  rosterSpots: PlayByPlayPlayer[];
};

export class DataLoopService {
  private dataFetchInterval: NodeJS.Timeout | null = null;

  private gameData: GameData | null = null;

  private gameDataPromise: Promise<void> | null = null;

  private fetchLogosPromise: Promise<void> | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly nhlApi: NhlApi,
    private readonly teamsService: TeamsService,
    private readonly logosService: LogosService,
    private readonly activeTeamService: ActiveTeamService,
  ) {}

  startLoop() {
    // Fetch data immediately, then every 5 seconds
    this.dataLoop(); // Initial fetch
    this.dataFetchInterval = setInterval(() => {
      this.dataLoop();
    }, 100);

    this.logger.info('Data loop started: data fetch every 5s');
  }

  stopLoop() {
    if (this.dataFetchInterval) {
      clearInterval(this.dataFetchInterval);
      this.dataFetchInterval = null;
      this.logger.info('Data loop stopped');
    }
  }

  get boxscore() {
    return this.gameData;
  }

  private dataLoop() {
    const activeTeam = this.activeTeamService.team;
    this.fetchGameData(activeTeam);
    this.fetchLogos();
  }

  private fetchGameData(teamAbbrev: string) {
    if (!this.gameDataPromise) {
      this.gameDataPromise = this.fetchActiveGameData(teamAbbrev);

      this.gameDataPromise
        .catch((error) => {
          this.logger.error(error);
        })
        .finally(() => {
          this.gameDataPromise = null;
        });
    }
  }

  private async fetchActiveGameData(teamAbbrev: string) {
    const activeGame = await this.teamsService.getActiveGameForTeam(teamAbbrev);
    if (!activeGame) {
      this.logger.debug('No active game found for team: ' + teamAbbrev);
      return;
    }

    const playByPlay = await this.nhlApi.getPlayByPlay(activeGame.id);

    const homeTeam = {
      id: activeGame.homeTeam.id,
      abbrev: activeGame.homeTeam.abbrev,
      score: playByPlay.homeTeam.score,
    };
    const awayTeam = {
      id: activeGame.awayTeam.id,
      abbrev: activeGame.awayTeam.abbrev,
      score: playByPlay.awayTeam.score,
    };

    this.gameData = {
      id: activeGame.id,
      startTime: activeGame.gameStart,
      gameType: activeGame.gameType,
      gameState: activeGame.gameState,
      homeTeam,
      awayTeam,
      clock: {
        secondsRemaining: playByPlay.clock.secondsRemaining,
        running: playByPlay.clock.running,
        inIntermission: playByPlay.clock.inIntermission,
      },
      outcome: playByPlay.gameOutcome?.lastPeriodType,
      events: playByPlay.plays,
      rosterSpots: playByPlay.rosterSpots,
    };

    if (playByPlay.periodDescriptor) {
      this.gameData.period = {
        number: playByPlay.periodDescriptor.number,
        type: playByPlay.periodDescriptor.periodType,
      };
    }
  }

  private fetchLogos() {
    if (!this.fetchLogosPromise) {
      this.fetchLogosPromise = this.logosService.getLogos();

      this.fetchLogosPromise
        .catch((error) => {
          this.logger.error('Error fetching logos:', error);
        })
        .finally(() => {
          this.fetchLogosPromise = null;
        });
    }
  }
}
