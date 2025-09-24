import { Leader } from "../Leader";
import { Member } from "./Member";
import { MissionStatus } from "./enum";

export class Mission {
  members: Member[];
  status: MissionStatus;
  id: number | undefined;
  name: any;

  constructor() {
    this.members = [];
    this.status = MissionStatus.NotStarted;
  }

  startMission(): void {
    this.status = MissionStatus.InProgress;
  }

  finishMission(): void {
    this.status = MissionStatus.Finished;
  }

  addMember(member: Member): void {
    this.members.push(member);
  }

  removeMember(member: Member): void {
    this.members = this.members.filter((m) => m.id !== member.id);
  }
}


