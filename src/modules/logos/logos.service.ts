import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import ky from 'ky';

import type { Logger } from '@/lib/logger/logger.js';
import { TeamsService } from '@/modules/teams/teams.service.js';

// 30 days
const LOGOS_TTL = 1000 * 60 * 60 * 24 * 30;
const LOGOS_DIR = path.join(import.meta.dirname, '../../../assets/logos');

export class LogosService {
  constructor(
    private readonly logger: Logger,
    private readonly teamsService: TeamsService,
  ) {}

  async getLogos() {
    // read last fetched time
    try {
      const lastFetched = await fs.readFile(
        path.join(LOGOS_DIR, '.last-fetched'),
        'utf8',
      );

      const lastFetchedDate = new Date(lastFetched);
      const now = new Date();

      const diff = now.getTime() - lastFetchedDate.getTime();

      if (diff < LOGOS_TTL) {
        this.logger.debug('Logos are fresh, no need to fetch.');
        return;
      }

      this.logger.debug('Logos are stale, fetching new logos.');
    } catch {
      this.logger.debug('Logos are stale, fetching new logos.');
    }

    const teams = await this.teamsService.getTeams();

    for (const team of teams) {
      this.logger.debug(`Fetching logo for team ${team.id}`);
      const response = await ky.get(team.logoUrl);

      // save image as [abbrev].svg
      const svg = await response.text();

      await fs.writeFile(path.join(LOGOS_DIR, `${team.id}.svg`), svg);

      this.logger.debug(`Saved logo for team ${team.id}`);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    }

    // write last fetched time
    await fs.writeFile(
      path.join(LOGOS_DIR, '.last-fetched'),
      new Date().toISOString(),
    );
  }
}
