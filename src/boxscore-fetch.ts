import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import ky from 'ky';
import { z } from 'zod';

const cachedItems: string[] = [];
const dataDir = path.join(import.meta.dirname, '../data');

const dataSchema = z.object({
  gamesByDate: z.array(
    z.object({
      date: z.string(),
      games: z.array(z.any()),
    }),
  ),
});

const fetchBoxscore = async () => {
  const data = await ky
    .get('https://api-web.nhle.com/v1/scoreboard/now')
    .json();

  const parsed = dataSchema.parse(data);

  const schedGames = parsed.gamesByDate.filter((g) => {
    // get today in YYYY-MM-DD
    const today = new Date();

    const todayString = today.toISOString().split('T')[0];

    // get yesterdays games, todays games and tomorrows games, and take into consideration timezone differences
    if (g.date === todayString) {
      return true;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    if (g.date === yesterdayString) {
      return true;
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    if (g.date === tomorrowString) {
      return true;
    }

    return false;
  });

  schedGames
    .map((g) => g.games)
    .flat()
    .forEach((game) => {
      const parsedGame = {
        id: game.id,
        clock: game.clock
          ? {
              running: game.clock.running,
              inIntermission: game.clock.inIntermission,
            }
          : undefined,
        gameState: game.gameState,
        gameScheduleState: game.gameScheduleState,
        period: game.period,
        periodDescriptor: game.periodDescriptor,
      };

      const md5Hash = crypto
        .createHash('md5')
        .update(JSON.stringify(parsedGame))
        .digest('hex');

      if (cachedItems.includes(md5Hash)) {
        return;
      }

      cachedItems.push(md5Hash);

      parsedGame.clock = game.clock;

      // write as GAMEID_YYYY-MM-DD_HH-MM-SS.json
      const fileName = `${game.id}_${new Date()
        .toISOString()
        .replace(/:/g, '-')
        .replace(/\..+/, '')}.json`;

      // await fs.mkdir(dataDir, { recursive: true });
      fs.writeFile(
        path.join(dataDir, fileName),
        JSON.stringify(game, null, 2),
      ).catch(console.error);
    });
};

fetchBoxscore().catch(console.error);

setInterval(() => {
  fetchBoxscore().catch(console.error);
}, 5000);
