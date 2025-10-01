import { Leader } from "./Leader";
import { Member } from "./Member";


export class Mission {
  // กำหนดค่าสถานะภายในคลาส Mission โดยตรง
  static readonly STATUS = {
    NotStarted: "not_started",
    InProgress: "in_progress",
    Finished: "finished"
  } as const;
  
  private members: Member[] = [];
  private _status: string = Mission.STATUS.NotStarted;
  
  get status(): string {
    return this._status;
  }

  constructor(
    public id: number,
    public name: string,
    public leader: Leader
  ) {}

  getMembers(): Member[] {
    return this.members;
  }
  startMission(): void {
    this._status = Mission.STATUS.InProgress;
  }

  addMember(member: Member): void {
    this.members.push(member);
  }

  removeMember(member: Member): void {
    this.members = this.members.filter((m) => m.id !== member.id);
  }

  finishMission(): void {
    this._status = Mission.STATUS.Finished;
  }
  // ลบเมธอด getters ที่ซ้ำซ้อนกับ getMembers

}

