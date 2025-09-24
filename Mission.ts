import { Leader } from "../Leader";
import { Member } from "./Member";
import { MissionStatus } from "./enum";

export class Mission {
  private members: Member[] = [];
  private status: MissionStatus = MissionStatus.NotStarted;

  constructor(
    public id: number,
    public name: string,
    public leader: Leader
  ) {}

  startMission(): void {
    this.status = MissionStatus.InProgress;
  }

  addMember(member: Member): void {
    this.members.push(member);
  }

  removeMember(member: Member): void {
    this.members = this.members.filter((m) => m.id !== member.id);
  }

  finishMission(): void {
    this.status = MissionStatus.Finished;
  }

}

