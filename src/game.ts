export class NHLGame {
  constructor(
    private homeTeam: string,
    private awayTeam: string,
    private homeScore: number,
    private awayScore: number,
    private time: string,
    private period: number,
  ) {}

  updateTime(time: string) {
    this.time = time;
  }

  updateScore(home: number, away: number) {
    this.homeScore = home;
    this.awayScore = away;
  }

  updatePeriod(period: number) {
    this.period = period;
  }

  getHomeTeam() {
    return this.homeTeam;
  }

  getAwayTeam() {
    return this.awayTeam;
  }

  getHomeScore() {
    return this.homeScore;
  }

  getAwayScore() {
    return this.awayScore;
  }

  getTime() {
    return this.time;
  }

  getPeriod() {
    return this.period;
  }
}
