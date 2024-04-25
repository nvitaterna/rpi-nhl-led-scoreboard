import { BoxscoreData } from '@/boxscore/boxscore.schema';
import { UiDataRepository } from './ui-data.repository';
import { UiData } from './ui-data.schema';
import { LogoService } from '@/logo/logo.service';

export class UiDataService {
  uiDataCache: UiData | null = null;

  constructor(
    private uiDataRepository: UiDataRepository,
    private logoService: LogoService,
  ) {}

  async get() {
    if (!this.uiDataCache) {
      this.uiDataCache = await this.uiDataRepository.get();
    }
    return this.uiDataRepository.get();
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

    this.uiDataCache = {
      boxscore,
      homeTeamLogo: homeTeamLogo.logo,
      awayTeamLogo: awayTeamLogo.logo,
    };

    this.uiDataRepository.set(this.uiDataCache);
  }

  getFromCache() {
    return this.uiDataCache;
  }
}
