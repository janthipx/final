
import { ScoreResult } from "./Final/enum";

export class Score {
  constructor(
    public memberId: number,
    public missionId: number,
    public score: number,
    public result: ScoreResult
  ) {}

  calculateScore(): number {
    return this.score;
  }
}
