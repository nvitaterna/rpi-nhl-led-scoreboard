import { ScoreResponse } from './types/score-response';
import { StandingsResponse } from './types/standings-response';

const BASE_URL = 'https://api-web.nhle.com/v1';

export const getScores = async (date: string): Promise<ScoreResponse> => {
  const response = await fetch(`${BASE_URL}/schedule/${date}`);
  const data = await response.json();
  return data;
};

export const getStandings = async (
  date: string,
): Promise<StandingsResponse> => {
  const response = await fetch(`${BASE_URL}/standings/${date}`);
  const data = await response.json();
  return data;
};
