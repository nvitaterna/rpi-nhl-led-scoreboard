// hockey events

import type { PeriodType } from '../nhl-api/nhl-api.schemas.js';

type EventType =
  | 'clock-start'
  | 'clock-stop'
  | 'period-start'
  | 'period-end'
  | 'goal'
  | 'penalty'
  | 'overtime-start'
  | 'overtime-end'
  | 'shootout-start'
  | 'shootout-end'
  | 'intermission-start'
  | 'intermission-end'
  | 'shootout-attempt'
  | 'shootout-goal'
  | 'shootout-miss';

type Player = {
  teamAbbrev: string;
  firstName: string;
  lastName: string;
  number: number;
};

export type GameEvent = {
  type: EventType;
  timestamp: number; // in seconds
  secondsRemaining: number;
};

export type ClockStartEvent = GameEvent & {
  type: 'clock-start';
};

export type ClockStopEvent = GameEvent & {
  type: 'clock-stop';
};

export type PeriodStartEvent = GameEvent & {
  type: 'period-start';
  period: {
    number: number;
    periodType: PeriodType;
  };
};

export type PeriodEndEvent = GameEvent & {
  type: 'period-end';
  period: {
    number: number;
    periodType: PeriodType;
  };
};

export type GoalEvent = GameEvent & {
  type: 'goal';
  team: 'home' | 'away';
  player: Player;
};

export type PenaltyEvent = GameEvent & {
  type: 'penalty';
  team: 'home' | 'away';
  player: Player;
};

export type OvertimeStartEvent = GameEvent & {
  type: 'overtime-start';
};

export type OvertimeEndEvent = GameEvent & {
  type: 'overtime-end';
};

export type ShootoutStartEvent = GameEvent & {
  type: 'shootout-start';
};

export type ShootoutEndEvent = GameEvent & {
  type: 'shootout-end';
};

export type IntermissionStartEvent = GameEvent & {
  type: 'intermission-start';
  intermission: number;
};

export type IntermissionEndEvent = GameEvent & {
  type: 'intermission-end';
  period: {
    number: number;
    periodType: PeriodType;
  };
};

export type ShootoutAttemptEvent = GameEvent & {
  type: 'shootout-attempt';
  team: 'home' | 'away';
  player: Player;
};

export type ShootoutGoalEvent = GameEvent & {
  type: 'shootout-goal';
  team: 'home' | 'away';
  player: Player;
};

export type ShootoutMissEvent = GameEvent & {
  type: 'shootout-miss';
  team: 'home' | 'away';
  player: Player;
};
