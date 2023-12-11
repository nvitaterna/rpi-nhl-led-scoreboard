import fs from 'fs/promises';
import path from 'path';
import { MappedTeam, MappedTeamWithLogo } from './prepare-logos';
import sharp from 'sharp';

const LOGO_HEIGHT = 32;

interface TeamWithLogoBuffer extends MappedTeam {
  logoBuffer: Buffer;
}

export const mapBuffers = async () => {
  // load teams.json
  const teams: MappedTeamWithLogo[] = JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'assets/teams.json'), 'utf-8'),
  );

  // map buffers
  const teamsWithLogoBuffers: TeamWithLogoBuffer[] = await Promise.all(
    teams.map(async (team) => {
      console.log('mapping buffer for', team.name);
      const logoBuffer = await sharp(Buffer.from(team.svg), { density: 300 })
        .trim()
        .resize(LOGO_HEIGHT, LOGO_HEIGHT, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: sharp.kernel.cubic,
        })
        .removeAlpha()
        .raw()
        .toBuffer();

      console.log('mapped buffer for', team.name);

      // return team and buffer without team.svg property
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { svg, ...teamWithoutSvg } = team;
      return { ...teamWithoutSvg, logoBuffer };
    }),
  );

  return teamsWithLogoBuffers;
};
