import type {
  ClockStartEvent,
  ClockStopEvent,
  GameEvent,
} from './lib/events/events.js';
import { main } from './main.js';

// main();

const DELAY = 7000;

// game start exampe
const clockStartEvent: ClockStartEvent = {
  type: 'clock-start',
  timestamp: Date.now() - 5000,
  secondsRemaining: 1200,
};

const clockStopEvent: ClockStopEvent = {
  type: 'clock-stop',
  timestamp: Date.now() + 12000,
  secondsRemaining: 1190,
};

const anotherClockStartEvent: ClockStartEvent = {
  type: 'clock-start',
  timestamp: Date.now() + 14000,
  secondsRemaining: 1190,
};

const anotherClockStopEvent: ClockStopEvent = {
  type: 'clock-stop',
  timestamp: Date.now() + 21000,
  secondsRemaining: 1185,
};

export class GameEventHandler {
  private readonly eventQueue: GameEvent[] = [];

  private eventLoopInterval: NodeJS.Timeout | null = null;

  private clock = {
    timeRemaining: 1200,
    running: false,
  };

  private lastClockStartEvent: ClockStartEvent | null = null;

  private nextStopClockEvent: ClockStopEvent | null = null;

  pushEvent(event: GameEvent) {
    this.eventQueue.push(event);
  }

  eventLoop() {
    const now = Date.now() - DELAY;

    // Process events in the queue
    while (this.eventQueue.length > 0) {
      const nextEvent = this.eventQueue[0];

      if (nextEvent.timestamp > now) break; // Event is in the future

      const event = this.eventQueue.shift()!;

      console.log(event);

      if (event.type === 'clock-start') {
        this.clock.timeRemaining = event.secondsRemaining;
        this.clock.running = true;
        this.lastClockStartEvent = event as ClockStartEvent;
        this.nextStopClockEvent = this.eventQueue.find(
          (e) => e.type === 'clock-stop',
        ) as ClockStopEvent | null;
      } else if (event.type === 'clock-stop') {
        this.clock.timeRemaining = event.secondsRemaining;
        this.clock.running = false;
        if (this.nextStopClockEvent === event) {
          this.nextStopClockEvent = null;
        }
      }
    }

    // Update clock if running
    if (this.clock.running) {
      if (this.lastClockStartEvent) {
        let stopClockAt = 0;

        if (this.nextStopClockEvent) {
          stopClockAt = this.nextStopClockEvent.secondsRemaining;
        }

        const elapsed = Math.floor(
          (now - this.lastClockStartEvent.timestamp) / 1000,
        );
        this.clock.timeRemaining = Math.max(
          0,
          this.lastClockStartEvent.secondsRemaining - elapsed,
          stopClockAt,
        );
      }
    }

    console.log(this.clock);
  }

  startLoop() {
    this.eventLoopInterval = setInterval(() => {
      this.eventLoop();
    }, 50);
  }

  stopLoop() {
    if (this.eventLoopInterval) {
      clearInterval(this.eventLoopInterval);
      this.eventLoopInterval = null;
    }
  }
}

const handler = new GameEventHandler();

handler.pushEvent(clockStartEvent);
handler.pushEvent(clockStopEvent);
handler.pushEvent(anotherClockStartEvent);
handler.pushEvent(anotherClockStopEvent);

handler.startLoop();
