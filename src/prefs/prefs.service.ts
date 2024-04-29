import { TeamService } from '@/team/team.service';
import { PrefsRepository } from './prefs.repository';
import { teamSchema, timezoneSchema } from './prefs.schema';

export class PrefsService {
  constructor(
    private prefsRepository: PrefsRepository,
    private teamService: TeamService,
  ) {}

  async getTimezone() {
    const timezone = await this.prefsRepository.getPref('timezone');

    if (!timezone) {
      await this.setTimezone('America/Toronto');
    }

    return this.prefsRepository.getPref('timezone');
  }

  async setTimezone(timezone: string) {
    await timezoneSchema.parseAsync(timezone);

    return this.prefsRepository.setPref('timezone', timezone);
  }

  async getTeam() {
    const team = await this.prefsRepository.getPref('team');

    if (!team) {
      await this.setTeam('TOR');
    }

    return this.prefsRepository.getPref('team');
  }

  async setTeam(team: string) {
    await teamSchema.parseAsync(team);

    const availableTeam = await this.teamService.get(team);

    if (!availableTeam) {
      throw new Error('Invalid team');
    }

    return this.prefsRepository.setPref('team', team);
  }

  async getBrightness() {
    const brightness = await this.prefsRepository.getPref('brightness');

    if (!brightness) {
      await this.setBrightness(80);
    }

    return this.prefsRepository.getPref('brightness');
  }

  async setBrightness(brightness: number) {
    const parsedBrightness = Math.round(brightness);

    if (parsedBrightness < 0 || parsedBrightness > 100) {
      throw new Error('Invalid brightness');
    }

    return this.prefsRepository.setPref('brightness', parsedBrightness);
  }
}
