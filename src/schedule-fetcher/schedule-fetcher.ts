import { getSchedule } from '../nhl-api/nhl-api';
import { ScheduleResponse } from '../nhl-api/types/schedule-response';
import { getCurrentDate } from '../utils/date';

// set throttle to 10 min in ms
const THROTTLE = 10 * 60 * 1000;

export class ScheduleFetcher {
  private lastFetched: Date = new Date(0);

  private schedule: ScheduleResponse | null = null;

  constructor(private teamAbbrev: string) {}

  private async fetchSchedule(tries = 0) {
    // fetch max via throttle
    const now = new Date();

    if (now.getTime() - this.lastFetched.getTime() <= THROTTLE && tries === 0) {
      return;
    }

    this.lastFetched = now;

    const currentDate = getCurrentDate();

    // get schedule in timezone
    try {
      this.schedule = await getSchedule(currentDate, this.teamAbbrev);
    } catch (e) {
      console.error('Error fetching schedule.');
      // try again after a 10 second delay, maximum 6 tries
      if (tries < 6) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.fetchSchedule(tries + 1));
          }, 10000);
        });
      }
    }
  }

  public getSchedule() {
    return this.schedule;
  }

  public loop() {
    this.fetchSchedule();
  }
}
