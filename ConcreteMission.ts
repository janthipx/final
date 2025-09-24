import { Mission } from "./Final/interface Misssion";
import { Leader } from "../Leader";
import { Member } from "./Final/Member";
import { MissionStatus } from "./Final/enum";

export class ConcreteMission implements Mission {
  public members: Member[] = [];
  public status: MissionStatus = MissionStatus.NotStarted;

  constructor(public id: number, public name: string, public leader: Leader) {}

  startMission(): void {
    this.status = MissionStatus.InProgress;
  }

  finishMission(): void {
    this.status = MissionStatus.Finished;
  }

  addMember(member: Member): void {
    if (!this.members.includes(member)) {
      this.members.push(member);
    }
  }

  removeMember(member: Member): void {
    this.members = this.members.filter((m) => m.id !== member.id);
  }
}
