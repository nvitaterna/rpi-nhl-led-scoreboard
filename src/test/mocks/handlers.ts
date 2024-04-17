import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('https://api-web.nhle.com/v1/standings/now', async () => {
    const data = await import('./data/standings-response.json');

    return HttpResponse.json(data);
  }),
  http.get(
    'https://api-web.nhle.com/v1/club-schedule-season/:team/now',
    async () => {
      const data = await import('./data/schedule-response.json');

      return HttpResponse.json(data);
    },
  ),
  http.get(
    'https://api-web.nhle.com/v1/gamecenter/2023021260/boxscore',
    async () => {
      const data = await import('./data/boxscore-response.json');

      return HttpResponse.json(data);
    },
  ),
];
