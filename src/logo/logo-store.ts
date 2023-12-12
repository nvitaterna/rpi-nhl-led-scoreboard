import { TeamWithLogo } from './prepare-logos';

export class LogoStore {
  constructor(private readonly logos: TeamWithLogo[]) {}

  getLogoBuffer = (abbrev: string) => {
    const team = this.logos.find((team) => team.abbrev === abbrev);

    if (!team) {
      throw new Error(`No logo found for team code ${abbrev}`);
    }

    return team.data;
  };
}
