
import { Mission } from "./Misssion";
import { MemberStatus } from "./enum";


export class Member {
  constructor(
    public id: number,
    public name: string,
    public status: MemberStatus = MemberStatus.Inactive
  ) {}

  joinMission(mission: Mission): void {
    mission.addMember(this);
    this.status = MemberStatus.Joined;
  }

  leaveMission(mission: Mission): void {
    mission.removeMember(this);
    this.status = MemberStatus.Left;
  }
}
