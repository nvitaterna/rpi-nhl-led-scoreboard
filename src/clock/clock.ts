import { parseMinutesSeconds } from '../utils/time';

export class Clock {
  private time = 20 * 60;

  private stopClockAt: number | null = null;

  running = false;

  period = 1;

  private timeLastDecrement = new Date().getTime();

  setTime(time: number | string) {
    if (typeof time === 'string') {
      const [minutes, seconds] = time.split(':');
      this.time = parseInt(minutes) * 60 + parseInt(seconds);
    } else {
      this.time = time;
    }
  }

  //convert time to string
  getTime() {
    const minutes = Math.floor(this.time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.time % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  setPeriod(period: number) {
    this.period = period;
  }

  getPeriod() {
    return this.period;
  }

  startClock(time: string) {
    this.setTime(time);
    this.running = true;
    this.stopClockAt = null;
  }

  stopClock(time: string) {
    const stoppedTime = parseMinutesSeconds(time);

    if (this.time <= stoppedTime) {
      this.time = stoppedTime;
      this.stopClockAt = null;
    } else {
      this.stopClockAt = stoppedTime;
    }

    this.running = false;
  }

  loop() {
    const now = new Date().getTime();
    const delta = now - this.timeLastDecrement;

    if (this.time <= 0) {
      this.running = false;
      this.time = 0;
    }

    if (delta > 1000 && this.running) {
      this.timeLastDecrement = now;
      this.time--;
    } else if (
      delta > 1000 &&
      this.stopClockAt &&
      this.time > this.stopClockAt
    ) {
      this.timeLastDecrement = now;
      this.time--;
    } else if (this.stopClockAt && this.time < this.stopClockAt) {
      this.stopClockAt = null;
    }
  }
}
