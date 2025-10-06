import type { ScheduledGame } from '@/lib/nhl-api/schedule/schedule.schemas.js';

export type GameState = 'pre' | 'inProgress' | 'final';

export const gameStateMapper = (
  gameState: ScheduledGame['gameState'],
): GameState => {
  switch (gameState) {
    case 'FUT':
      return 'pre';
    case 'FINAL':
    case 'OFF':
      return 'final';
    case 'LIVE':
    case 'CRIT':
      return 'inProgress';
    default:
      return 'inProgress';
  }
};
