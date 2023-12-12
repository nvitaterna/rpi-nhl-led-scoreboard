import { getStandings } from '../nhl-api/nhl-api';
import fs from 'fs/promises';
import path from 'path';
import { svgToBuffer } from './svg-to-buffer';
import { LOGO_FILE } from './constants';

export interface TeamWithLogo {
  abbrev: string;
  data: Buffer;
}

// doesn't need to be run very often - this just ensures we have all logos & team data saved locally
export const prepareLogos = async (force = false) => {
  // check if we have logos already
  const teamsJson = await fs.readFile(LOGO_FILE).catch(() => null);

  if (teamsJson && !force) {
    return;
  }
  const standings = await getStandings(new Date().toISOString().slice(0, 10));

  const teams = standings.standings.map((standing) => {
    return {
      abbrev: standing.teamAbbrev.default,
      logoUrl: standing.teamLogo,
    };
  });

  const teamsWithLogos: TeamWithLogo[] = [];

  // fetch team logos in series and populate teamsWithLogos
  for (const team of teams) {
    const response = await fetch(team.logoUrl);
    const svg = await response.text();

    console.log('Mapping buffer for', team.abbrev);

    const logoBuffer = await svgToBuffer(svg);

    teamsWithLogos.push({
      abbrev: team.abbrev,
      data: logoBuffer,
    });

    console.log('mapped buffer for ', team.abbrev);

    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // save teams as json data
  await fs.writeFile(path.join(LOGO_FILE), JSON.stringify(teamsWithLogos));
};
