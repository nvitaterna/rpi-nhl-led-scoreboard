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
  gameState: string;
  gameScheduleState: string;
  awayTeam: Team;
  homeTeam: Team;
  gameCenterLink: string;
  neutralSite: boolean;
  venueTimezone: string;
  ticketsLink: string;
  teamLeaders: TeamLeader[];
}

export interface TeamLeader {
  id: number;
  name: LocalizedName;
  headshot: string;
  teamAbbrev: string;
  category: string;
  value: number;
}

export interface Team {
  id: number;
  name: LocalizedName;
  abbrev: string;
  record: string;
  logo: string;
  odds: Odd[];
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
