import { Team } from '../../team/team';
import { GameState } from './game-state';
import { LocalizedName } from './localized-name';

export interface ScoreResponse {
  prevDate: string;
  currentDate: string;
  nextDate: string;
  gameWeek: GameWeek[];
  oddsPartners: OddsPartner[];
  games: Game[];
}

export interface Game {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: Venue;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: TvBroadcast[];
  gameState: GameState;
  gameScheduleState: string;
  awayTeam: Team;
  homeTeam: Team;
  gameCenterLink: string;
  clock?: Clock;
  neutralSite: boolean;
  venueTimezone: string;
  period?: number;
  periodDescriptor?: PeriodDescriptor;
  goals?: Goal[];
  ticketsLink?: string;
  teamLeaders?: TeamLeader[];
}

export interface TeamLeader {
  id: number;
  name: LocalizedName;
  headshot: string;
  teamAbbrev: string;
  category: string;
  value: number;
}

export interface Goal {
  period: number;
  periodDescriptor: PeriodDescriptor;
  timeInPeriod: string;
  playerId: number;
  name: Venue;
  mugshot: string;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string;
  highlightClip: number;
  highlightClipFr?: number;
}

export interface PeriodDescriptor {
  number: number;
  periodType: 'REG' | 'OT' | 'SO';
}

export interface Clock {
  timeRemaining: string;
  secondsRemaining: number;
  running: boolean;
  inIntermission: boolean;
}

export interface Odd {
  providerId: number;
  value: string;
}

export interface TvBroadcast {
  id: number;
  market: string;
  countryCode: string;
  network: string;
}

export interface Venue {
  default: string;
}

export interface OddsPartner {
  partnerId: number;
  country: string;
  name: string;
  imageUrl: string;
  siteUrl?: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export interface GameWeek {
  date: string;
  dayAbbrev: string;
  numberOfGames: number;
}
