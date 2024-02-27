import Conf from 'conf';

export const config = new Conf<{
  timezone: string;
  teamAbbrev: string;
}>({
  projectName: 'rpi-nhl-scoreboard',
  projectVersion: '0.1.1',
  schema: {
    teamAbbrev: {
      type: 'string',
      default: 'TOR',
    },
    timezone: {
      type: 'string',
      default: 'America/Toronto',
    },
  },
});
