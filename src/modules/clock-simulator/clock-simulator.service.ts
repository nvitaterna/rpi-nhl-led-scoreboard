import * as fs from 'node:fs/promises';

import type { Logger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';
import type {
  PlayByPlayEvent,
  PlayByPlayResponse,
} from '@/lib/nhl-api/play-by-play/play-by-play.schemas.js';
import { parseTimeRemaining } from '@/lib/utils/parse-time-remaining.js';

import { ClockEvent } from './clock-event.js';

const DELAY = 60 * 1000; // 60 seconds delay;

type Clock = {
  secondsRemaining: number;
  isRunning: boolean;
  period: number;
};

export class ClockSimulatorService {
  private readonly eventQueue: ClockEvent[] = [];
  private readonly processedEvents: Map<number, PlayByPlayEvent> = new Map();
  private lastClockUpdate = 0;
  private clockLoopInterval: NodeJS.Timeout | null = null;

  private secondsRemaining = 0;
  private delayedSecondsRemaining = 0;
  private period = 1;
  private isRunning = false;

  private previousStartEvent: ClockEvent | null = null;
  private nextStopEvent: ClockEvent | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly nhlApi: NhlApi,
    private readonly gameId: number,
  ) {}

  public getClock(): Clock | null {
    return {
      secondsRemaining: this.delayedSecondsRemaining,
      isRunning: this.isRunning,
      period: this.period,
    };
  }

  private async fetchPlayByPlayData(): Promise<PlayByPlayResponse> {
    const result = await fs.readFile(import.meta.dirname + '/ex.json', 'utf-8');

    return JSON.parse(result) as PlayByPlayResponse;
    // return this.nhlApi.getPlayByPlay(this.gameId);
  }

  private async startSimulator() {
    const playByPlayResponse = await this.fetchPlayByPlayData();

    if (!playByPlayResponse.periodDescriptor) {
      this.logger.debug('No period descriptor found in play-by-play data');
      return;
    }

    const secondsRemaining =
      playByPlayResponse.clock.secondsRemaining + DELAY / 1000;

    // find the play that happened just before the current clock time, including period
    const previousPlayByPlay = playByPlayResponse.plays
      .sort(
        (a, b) =>
          parseTimeRemaining(b.timeRemaining) -
          parseTimeRemaining(a.timeRemaining),
      )
      .filter(
        (play) =>
          play.periodDescriptor.number ===
          playByPlayResponse.periodDescriptor?.number,
      )
      .filter((play) => {
        return (
          parseTimeRemaining(play.timeRemaining) >= secondsRemaining &&
          ClockEvent.isClockEvent(play)
        );
      })
      .reverse()[0];

    if (!previousPlayByPlay) {
      this.logger.debug('No previous play found in play-by-play data');
      return;
    }

    this.logger.info(
      `Starting clock simulator with event ${previousPlayByPlay.eventId} at period ${previousPlayByPlay.periodDescriptor.number} with ${parseTimeRemaining(
        previousPlayByPlay.timeRemaining,
      )} seconds remaining.`,
    );

    // filter out all events that happened before this play

    const filteredEvents = playByPlayResponse.plays.filter((play) => {
      return play.sortOrder >= (previousPlayByPlay.sortOrder || 0);
    });

    this.logger.info(`Processing filtered events: ${filteredEvents.length}`);

    this.processEvents(filteredEvents);
  }

  private async processEvents(events: PlayByPlayEvent[]) {
    const filteredEvents = events
      .filter((event) => {
        return ClockEvent.isClockEvent(event);
      })
      .filter((event) => {
        return !this.processedEvents.has(event.eventId);
      })
      .filter((event) => {
        // filter out events with a sort order less than the highest processed event
        const highestProcessedSortOrder = Math.max(
          0,
          ...Array.from(this.processedEvents.values()).map(
            (e) => e.sortOrder || 0,
          ),
        );
        return (event.sortOrder || 0) >= highestProcessedSortOrder;
      });

    filteredEvents
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .forEach((event) => {
        const clockEvent = new ClockEvent(event);
        this.eventQueue.push(clockEvent);
        this.processedEvents.set(event.eventId, event);
      });
  }

  private clockLoop() {
    if (this.lastClockUpdate < Date.now() - 1000) {
      this.lastClockUpdate = Date.now();

      if (this.clock?.isRunning) {
        this.clock.secondsRemaining = Math.max(
          0,
          this.clock.secondsRemaining - 1,
        );
      }
    }

    // Process events in the queue

    if (this.eventQueue.length === 0) {
      return;
    }

    const currentClock = this.clock?.secondsRemaining || Infinity;

    const nextEvent = this.eventQueue[0];

    switch (nextEvent.type) {
      case 'start': {
        if (
          this.nextStopEvent &&
          this.nextStopEvent.secondsRemaining > currentClock
        ) {
          // wait for this stop event to be processed first
          this.logger.debug(
            'Delaying start event processing until stop event is processed',
          );
          return;
        } else {
          // process start event
          this.logger.debug(
            `Processing start event at ${nextEvent.secondsRemaining} seconds remaining`,
          );
          this.previousStartEvent = nextEvent;
          this.eventQueue.shift();

          this.clock = {
            secondsRemaining: nextEvent.secondsRemaining,
            isRunning: true,
            period: nextEvent.period,
          };
        }
        break;
      }
      case 'stop': {
        // process stop event
        if (
          this.previousStartEvent &&
          this.previousStartEvent.secondsRemaining > nextEvent.secondsRemaining
        ) {
          // wait for this start event to be processed first
          this.logger.debug(
            'Delaying stop event processing until start event is processed',
          );
          return;
        } else {
          // process stop event
          this.logger.debug(
            `Processing stop event at ${nextEvent.secondsRemaining} seconds remaining`,
          );
          this.nextStopEvent = nextEvent;
          this.eventQueue.shift();

          this.clock = {
            secondsRemaining: nextEvent.secondsRemaining,
            isRunning: false,
            period: nextEvent.period,
          };
        }
        break;
      }
    }
  }

  public async startClock() {
    await this.startSimulator();

    this.clockLoopInterval = setInterval(() => {
      this.clockLoop();
    }, 50);
  }

  public stopClock() {
    if (this.clockLoopInterval) {
      clearInterval(this.clockLoopInterval);
      this.clockLoopInterval = null;
    }
  }
}
