import { ScheduleResponse } from './types/schedule-response';
import { ScoreResponse } from './types/score-response';
import { StandingsResponse } from './types/standings-response';

export const BASE_URL = 'https://api-web.nhle.com/v1';

export const getScores = async (date: string): Promise<ScoreResponse> => {
  const response = await fetch(`${BASE_URL}/score/${date}`);

  if (response.status >= 400) {
    console.error(await response.text());
    throw new Error('Bad response from server for scores');
  }

  const data = await response.json();
  return data;
};

export const getStandings = async (
  date: string,
): Promise<StandingsResponse> => {
  const response = await fetch(`${BASE_URL}/standings/${date}`);

  if (response.status >= 400) {
    console.error(await response.text());
    throw new Error('Bad response from server for standings');
  }

  const data = await response.json();
  return data;
};

export const getSchedule = async (
  date: string,
  teamAbbrev: string,
): Promise<ScheduleResponse> => {
  const response = await fetch(
    `${BASE_URL}/club-schedule/${teamAbbrev}/week/${date}`,
  );

  if (response.status >= 400) {
    console.error(await response.text());
    throw new Error('Bad response from server for schedule');
  }
  const data = await response.json();
  return data;
};
