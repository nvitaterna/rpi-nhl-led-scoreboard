import { bootstrap } from './bootstrap';
import { LogoStore } from './logo/logo-store';
import { loop } from './loop';
import { ScheduleFetcher } from './schedule-fetcher/schedule-fetcher';
import { ScoreFetcher } from './score-fetcher/score-fetcher';

const main = async () => {
  const { matrix, logos } = await bootstrap();

  matrix.brightness(100);

  const teamAbbrev = 'TOR';
  const scheduleFetcher = new ScheduleFetcher(teamAbbrev);
  const scoreFetcher = new ScoreFetcher();

  const logoStore = new LogoStore(logos);

  setInterval(() => {
    loop(matrix, logoStore, scheduleFetcher, scoreFetcher);
  }, 50);
};

main();
