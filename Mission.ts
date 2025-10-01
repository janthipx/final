import { MemberStatus } from "./enum";
import { User } from "./User";

export class Member extends User {
  constructor(
    public id: number,
    public name: string,
    public status: MemberStatus = MemberStatus.Inactive
  ) {
    super(id, name);
  }


  joinMission(): void {
    this.status = MemberStatus.Joined;
  }
  leaveMission(): void {
    this.status = MemberStatus.Left;
  }
  Inactive(): void {
    this.status = MemberStatus.Inactive;
  }
  Active(): void {
    this.status = MemberStatus.Active;
  }
}
