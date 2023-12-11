import { getStandings } from '../nhl-api/nhl-api';
import fs from 'fs/promises';
import path from 'path';

export interface MappedTeam {
  code: string;
  name: string;
  shortName: string;
  logoUrl: string;
}

export interface MappedTeamWithLogo extends MappedTeam {
  svg: string;
}

// doesn't need to be run very often - this just ensures we have all logos & team data saved locally
export const prepareLogos = async () => {
  const standings = await getStandings(new Date().toISOString().slice(0, 10));

  const teams: MappedTeam[] = standings.standings.map((standing) => {
    return {
      code: standing.teamAbbrev.default,
      name: standing.teamName.default,
      shortName: standing.teamCommonName.default,
      logoUrl: standing.teamLogo,
    };
  });

  const teamsWithLogos: MappedTeamWithLogo[] = [];

  // fetch team logos in series and populate teamsWithLogos
  for (const team of teams) {
    const response = await fetch(team.logoUrl);
    const svg = await response.text();

    teamsWithLogos.push({
      ...team,
      svg,
    });

    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // save teams as json data
  await fs.writeFile(
    path.join(process.cwd(), 'assets/teams.json'),
    JSON.stringify(teamsWithLogos),
  );
};

prepareLogos();
