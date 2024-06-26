import { BoxscoreData } from '@/boxscore/boxscore.schema';
import { UiDataRepository } from './ui-data.repository';
import { UiData } from './ui-data.schema';
import { LogoService } from '@/logo/logo.service';
import { PrefsService } from '@/prefs/prefs.service';

export class UiDataService {
  uiDataCache: UiData | null = null;

  constructor(
    private uiDataRepository: UiDataRepository,
    private logoService: LogoService,
    private prefsService: PrefsService,
  ) {}

  async get() {
    if (!this.uiDataCache) {
      this.uiDataCache = await this.uiDataRepository.get();
    }
    return this.uiDataCache;
  }

  async set(boxscore: BoxscoreData | null) {
    if (!boxscore) {
      return;
    }

    const homeTeamLogo = await this.logoService.get(boxscore.homeTeam);
    const awayTeamLogo = await this.logoService.get(boxscore.awayTeam);

    if (!homeTeamLogo || !awayTeamLogo) {
      throw new Error('Could not fetch logos');
    }

    const timezone = await this.prefsService.getTimezone();
    const brightness = await this.prefsService.getBrightness();

    this.uiDataCache = {
      boxscore,
      homeTeamLogo: homeTeamLogo.logo,
      awayTeamLogo: awayTeamLogo.logo,
      timezone,
      brightness,
    };

    this.uiDataRepository.set(this.uiDataCache);
  }

  getFromCache() {
    return this.uiDataCache;
  }
}
