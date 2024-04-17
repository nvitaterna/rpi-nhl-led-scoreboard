import { GameState } from './game-state';
import { LocalizedName } from './localized-name';
import { Team } from './team';

export interface BoxScoreResponse {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: LocalizedName;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: unknown[];
  gameState: GameState;
  gameScheduleState: string;
  period: number;
  periodDescriptor: PeriodDescriptor;
  awayTeam: Team;
  homeTeam: Team;
  clock: Clock;
}

export interface Clock {
  timeRemaining: string;
  secondsRemaining: number;
  running: boolean;
  inIntermission: boolean;
}

export interface PeriodDescriptor {
  number: number;
  periodType: string;
}
