import { MemberStatus } from "./enum";

export class Member {
  constructor(
    public id: number,
    public name: string,
    public status: MemberStatus = MemberStatus.Inactive
  ) {}

  User(): void {
    this.status = MemberStatus.Active;
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
