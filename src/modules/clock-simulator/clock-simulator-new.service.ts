import { EventEmitter } from 'node:stream';

import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';
import type { PlayByPlayResponse } from '@/lib/nhl-api/play-by-play/play-by-play.schemas.js';

import { ClockEvent } from './clock-event.js';

const POLL_INTERVAL = 5000; // 5 seconds

export class ClockSimulatorService extends EventEmitter {
  private readonly eventQueue: ClockEvent[] = [];
  private processedEvents: Set<number> = new Set();
  
  // Clock state
  private secondsRemaining: number | null = null;
  private isRunning: boolean = false;
  private period: number = 1;
  
  // Buffer system for 60s delay
  private readonly BUFFER_DELAY_MS = 60 * 1000; // 60 seconds
  private bufferedSecondsRemaining: number | null = null;
  private lastApiUpdate: number = 0;
  
  // Timers
  private pollingTimer: NodeJS.Timeout | null = null;
  private clockTimer: NodeJS.Timeout | null = null;
  private readonly CLOCK_TICK_INTERVAL = 100; // 100ms for smooth updates

  constructor(
    private readonly nhlApi: NhlApi,
    private readonly gameId: number,
  ) {
    super();
  }

  async start() {
    const playByPlayResponse = await this.nhlApi.getPlayByPlay(this.gameId);
    this.processPlayByPlayData(playByPlayResponse);
    this.startPolling();
    this.startClockSimulation();
  }

  private processPlayByPlayData(playByPlayResponse: PlayByPlayResponse) {
    // Extract clock events from play-by-play data
    const clockEvents: ClockEvent[] = [];
    
    for (const event of playByPlayResponse.plays) {
      if (ClockEvent.isClockEvent(event)) {
        try {
          const clockEvent = new ClockEvent(event);
          
          // Only add events we haven't processed yet
          if (!this.processedEvents.has(clockEvent.id)) {
            clockEvents.push(clockEvent);
          }
        } catch {
          // Skip invalid events
          continue;
        }
      }
    }
    
    // Sort events by sortOrder (chronological)
    clockEvents.sort((a, b) => a.sortOrder - b.sortOrder);
    
    // Add new events to queue
    this.eventQueue.push(...clockEvents);
    
    // Mark events as processed
    clockEvents.forEach(event => this.processedEvents.add(event.id));
    
    // Initialize clock state if this is the first load
    this.initializeClockState(playByPlayResponse, clockEvents);
  }

  private initializeClockState(playByPlayResponse: PlayByPlayResponse, newEvents: ClockEvent[]) {
    // Get current game state from the API response
    const currentPeriod = playByPlayResponse.periodDescriptor?.number || 1;
    const currentTimeRemaining = playByPlayResponse.clock?.timeRemaining;
    
    this.period = currentPeriod;
    
    if (currentTimeRemaining) {
      const currentSeconds = this.parseTimeRemaining(currentTimeRemaining);
      
      // Set buffered time (what the clock should show with delay)
      this.bufferedSecondsRemaining = currentSeconds;
      this.lastApiUpdate = Date.now();
      
      // Determine actual clock position by processing recent events
      this.secondsRemaining = this.calculateActualClockPosition(currentSeconds);
      
      // Determine if clock should be running
      this.isRunning = this.shouldClockBeRunning(newEvents);
    }
  }

  private calculateActualClockPosition(apiSeconds: number): number {
    // Start with API time and work forward based on recent events
    let calculatedSeconds = apiSeconds;
    const now = Date.now();
    const timeSinceUpdate = (now - this.lastApiUpdate) / 1000;
    
    // If clock should be running, subtract elapsed time
    if (this.isRunning && timeSinceUpdate < 60) { // Only if update is recent
      calculatedSeconds = Math.max(0, apiSeconds - timeSinceUpdate);
    }
    
    return calculatedSeconds;
  }

  private shouldClockBeRunning(events: ClockEvent[]): boolean {
    // Find the most recent clock event to determine if clock should be running
    const recentEvents = events.slice(-5); // Look at last 5 events
    
    for (let i = recentEvents.length - 1; i >= 0; i--) {
      const event = recentEvents[i];
      if (event.type === 'start') {
        return true;
      } else if (event.type === 'stop') {
        return false;
      }
    }
    
    // Default to stopped if no recent events
    return false;
  }

  private parseTimeRemaining(timeString: string): number {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  private startPolling() {
    this.pollingTimer = setInterval(async () => {
      try {
        const playByPlayResponse = await this.nhlApi.getPlayByPlay(this.gameId);
        this.processPlayByPlayData(playByPlayResponse);
      } catch (error) {
        this.emit('error', error);
      }
    }, POLL_INTERVAL);
  }

  private startClockSimulation() {
    this.clockTimer = setInterval(() => {
      this.updateClock();
    }, this.CLOCK_TICK_INTERVAL);
  }

  private updateClock() {
    if (this.secondsRemaining === null) return;

    // Process any events that should fire at current time
    this.processEventsAtCurrentTime();

    // Update buffered time (with 60s delay)
    this.updateBufferedTime();

    // Emit current state
    this.emitClockState();

    // Decrement clock if running
    if (this.isRunning && this.secondsRemaining > 0) {
      this.secondsRemaining -= this.CLOCK_TICK_INTERVAL / 1000;
      this.secondsRemaining = Math.max(0, this.secondsRemaining);
    }
  }

  private processEventsAtCurrentTime() {
    if (this.secondsRemaining === null) return;

    // Find events that should trigger at current time (within 1 second tolerance)
    const currentTime = Math.round(this.secondsRemaining);
    const eventsToProcess = this.eventQueue.filter(event => 
      Math.abs(event.secondsRemaining - currentTime) <= 1
    );

    for (const event of eventsToProcess) {
      // Apply the event
      if (event.type === 'start') {
        this.isRunning = true;
      } else if (event.type === 'stop') {
        this.isRunning = false;
      }

      // Remove from queue
      const index = this.eventQueue.indexOf(event);
      if (index > -1) {
        this.eventQueue.splice(index, 1);
      }

      // Emit event
      this.emit('clockEvent', event);
    }
  }

  private updateBufferedTime() {
    const now = Date.now();
    const timeBuffer = now - this.lastApiUpdate;

    // Only update buffered time if we have recent API data
    if (timeBuffer >= this.BUFFER_DELAY_MS && this.bufferedSecondsRemaining !== null) {
      // Buffered time catches up to actual time
      this.bufferedSecondsRemaining = this.secondsRemaining;
    }
  }

  private emitClockState() {
    this.emit('clockUpdate', {
      secondsRemaining: this.secondsRemaining,
      bufferedSecondsRemaining: this.bufferedSecondsRemaining,
      isRunning: this.isRunning,
      period: this.period,
    });
  }

  stop() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }

    if (this.clockTimer) {
      clearInterval(this.clockTimer);
      this.clockTimer = null;
    }

    this.emit('stopped');
  }

  pause() {
    this.isRunning = false;
    this.emit('paused');
  }

  resume() {
    this.isRunning = true;
    this.emit('resumed');
  }

  getCurrentState() {
    return {
      secondsRemaining: this.secondsRemaining,
      bufferedSecondsRemaining: this.bufferedSecondsRemaining,
      isRunning: this.isRunning,
      period: this.period,
      eventQueueLength: this.eventQueue.length,
    };
  }
}