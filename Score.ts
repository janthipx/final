
import { ScoreResult } from "./Final/enum";

export class Score {
  constructor(
    public memberId: number,
    public missionId: number,
    public score: number,
    public result: ScoreResult
  ) {}

  calculateScore(): number {
    if (this.result === ScoreResult.Success) {
      return this.score + 10; // เพิ่มคะแนนถ้าสำเร็จ
    } else {
      return this.score - 5; // ลดคะแนนถ้าไม่สำเร็จ
    }
  }
}
