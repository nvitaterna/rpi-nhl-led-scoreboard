import type { PlayByPlayEvent } from '@/lib/nhl-api/play-by-play/play-by-play.schemas.js';
import { parseTimeRemaining } from '@/lib/utils/parse-time-remaining.js';

interface IClockEvent {
  id: number;
  sortOrder: number;
  type: 'start' | 'stop';
  secondsRemaining: number;
}

export class ClockEvent implements IClockEvent {
  id: number;
  type: 'start' | 'stop';
  secondsRemaining: number;
  sortOrder: number;
  period: number;

  constructor(event: PlayByPlayEvent) {
    const type = ClockEvent.getClockEventType(event);

    if (type === null) {
      throw new Error('Not a clock event');
    }

    this.id = event.sortOrder;
    this.type = type;
    this.secondsRemaining = parseTimeRemaining(event.timeRemaining);
    this.sortOrder = event.sortOrder;
    this.period = event.periodDescriptor.number;
  }

  static isClockEvent(event: PlayByPlayEvent): boolean {
    return this.getClockEventType(event) !== null;
  }

  private static getClockEventType(
    event: PlayByPlayEvent,
  ): IClockEvent['type'] | null {
    switch (event.typeDescKey) {
      case 'game-end':
      case 'goal':
      case 'penalty':
      case 'period-end':
      case 'stoppage':
        return 'stop';
      case 'faceoff':
        return 'start';
      default:
        return null;
    }
  }
}
