import type { Config } from '@/lib/config/config.js';
import type { Logger } from '@/lib/logger/logger.js';

export class ActiveTeamService {
  private activeTeam: string;

  constructor(
    private readonly logger: Logger,
    config: Config,
  ) {
    this.logger.debug(
      'ActiveTeamService initialized with team: ' + config.team,
    );
    this.activeTeam = config.team;
  }

  set team(abbrev: string) {
    this.logger.info('Active team set to: ' + abbrev);
    this.activeTeam = abbrev;
  }

  get team(): string {
    return this.activeTeam;
  }
}
