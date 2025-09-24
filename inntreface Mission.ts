import { Leader } from "./Leader";
import { Member } from "./Member";
import { MissionStatus } from "./enum";

export interface Mission {
  id: number;
  name: string;
  leader: Leader;
  members: Member[];
  status: MissionStatus;

  startMission(): void;
  finishMission(): void;
  addMember(member: Member): void;
  removeMember(member: Member): void;
}
