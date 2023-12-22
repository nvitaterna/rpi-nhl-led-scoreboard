import { getSchedule } from '../nhl-api/nhl-api';
import { ScheduleResponse } from '../nhl-api/types/schedule-response';
import { getCurrentDate } from '../utils/date';

// set throttle to 10 min in ms
const THROTTLE = 10 * 60 * 1000;

export class ScheduleFetcher {
  private lastFetched: Date = new Date(0);

  private schedule: ScheduleResponse | null = null;

  constructor(private teamAbbrev: string) {}

  private async fetchSchedule() {
    // fetch max via throttle
    const now = new Date();

    if (now.getTime() - this.lastFetched.getTime() <= THROTTLE) {
      return;
    }

    this.lastFetched = now;

    const currentDate = getCurrentDate();

    // get schedule in timezone
    this.schedule = await getSchedule(currentDate, this.teamAbbrev);
  }

  public getSchedule() {
    return this.schedule;
  }

  public loop() {
    this.fetchSchedule();
  }
}
