import { NhlApi } from '../nhl-api/nhl-api';
import { TeamRepository } from './team.repository';

export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private nhlApi: NhlApi,
  ) {}

  async get(abbrev: string) {
    return await this.teamRepository.get(abbrev);
  }

  async getAll() {
    return await this.teamRepository.getAll();
  }

  async bootstrap() {
    const teams = await this.nhlApi.fetchTeams();

    await this.teamRepository.upsertMany(teams);
  }
}
