
import { Mission } from "./Final/interface Misssion";
import { Member } from "./Final/Member";
export class Database {
  private missions: Mission[] = [];
  private members: Member[] = [];

  saveMission(mission: Mission): void {
    this.missions.push(mission);
  }

  saveMember(member: Member): void {
    this.members.push(member);
  }

  fetchMission(id: number): Mission | null {
    return this.missions.find((m) => m.id === id) || null;
  }

  fetchMember(id: number): Member | null {
    return this.members.find((m) => m.id === id) || null;
  }
}
