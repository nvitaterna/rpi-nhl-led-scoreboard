import fs from 'fs/promises';
import { LOGO_FILE } from './constants';
import { TeamWithLogo } from './prepare-logos';

interface RawTeamWithLogo {
  abbrev: string;
  data: {
    type: 'Buffer';
    data: number[];
  };
}

export const loadLogos = async () => {
  const teamsJson = await fs.readFile(LOGO_FILE).catch(() => null);

  if (!teamsJson) {
    throw new Error('No logos found');
  }

  const teams: TeamWithLogo[] = JSON.parse(teamsJson.toString()).map(
    (team: RawTeamWithLogo) => {
      return {
        abbrev: team.abbrev,
        data: Buffer.from(team.data.data),
      };
    },
  );

  return teams;
};
