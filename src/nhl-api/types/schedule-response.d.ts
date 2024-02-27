import { Team } from './team';
import { GameState } from './game-state';

type PeriodType = 'REG' | 'OT' | 'SO';

export interface ScheduleResponse {
  previousSeason: number;
  currentSeason: number;
  clubTimezone: string;
  clubUTCOffset: string;
  games: Game[];
}

export interface Game {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: Venue;
  neutralSite: boolean;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  venueTimezone: string;
  gameState: GameState;
  gameScheduleState: string;
  tvBroadcasts: TvBroadcast[];
  awayTeam: Team;
  homeTeam: Team;
  periodDescriptor: PeriodDescriptor;
  gameOutcome?: GameOutcome;
  winningGoalie?: WinningGoalie;
  winningGoalScorer?: WinningGoalScorer;
  gameCenterLink: string;
  specialEvent?: FirstInitial;
  threeMinRecap?: string;
  threeMinRecapFr?: string;
  specialEventLogo?: string;
  ticketsLink?: string;
}

export interface WinningGoalScorer {
  playerId: number;
  firstInitial: FirstInitial;
  lastName: LastName2;
}

export interface LastName2 {
  default: string;
  cs?: string;
  fi?: string;
  sk?: string;
}

export interface WinningGoalie {
  playerId: number;
  firstInitial: FirstInitial;
  lastName: LastName;
}

export interface LastName {
  default: string;
  cs?: string;
  sk?: string;
}

export interface FirstInitial {
  default: string;
}

export interface GameOutcome {
  lastPeriodType: PeriodType;
}

export interface PeriodDescriptor {
  periodType?: PeriodType;
}

export interface PlaceName {
  default: string;
  fr?: string;
}

export interface TvBroadcast {
  id: number;
  market: string;
  countryCode: string;
  network: string;
}

export interface Venue {
  default: string;
  fr?: string;
  es?: string;
}
