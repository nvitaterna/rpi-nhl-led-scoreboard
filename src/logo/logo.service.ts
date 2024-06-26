import { TeamService } from '@/team/team.service';
import { svgToBuffer } from './logo.utils';
import { LogoRepository } from './logo.repository';
import { LogoData } from './logo.schema';
import { LoggerService } from '@/logger/logger.service';
import { Logger } from 'pino';

export const LOGO_SIZE = 32;

export class LogoService {
  private logger: Logger;
  constructor(
    private logoRepository: LogoRepository,
    private teamService: TeamService,
    loggerService: LoggerService,
  ) {
    this.logger = loggerService.child('logo.service');
  }

  async bootstrap() {
    const teams = await this.teamService.getAll();

    const teamLogos: LogoData[] = [];

    for (const team of teams) {
      const response = await fetch(team.logoUrl);

      const svg = await response.text();

      this.logger.info(
        {
          team,
        },
        `Mapping buffer for ${team.name}`,
      );

      const logoBuffer = await svgToBuffer(svg, LOGO_SIZE);

      teamLogos.push({
        team: team.abbrev,
        logo: logoBuffer,
      });

      // wait 250ms between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    await this.logoRepository.upsertMany(teamLogos);
  }

  async get(team: string) {
    return this.logoRepository.get(team);
  }
}
