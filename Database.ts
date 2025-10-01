import { Mission } from "./Mission";
import { Member } from "./Member";


export class Database {
  private missions: Mission[] = [];
  private members: Member[] = [];

  getMissions(): Mission[] {
    return this.missions;
  }
  saveMission(mission: Mission): void {
    this.missions.push(mission);
  }

  saveMember(member: Member): void {
    this.members.push(member);
  }

  deleteMission(id: number): void {
    this.missions = this.missions.filter((m) => m.id !== id);
  }

  updateMission(updatedMission: Mission): void {
    this.missions = this.missions.map((m) =>
      m.id === updatedMission.id ? updatedMission : m
    );
  }
  
  fetchMission(id: number): Mission | null {
    return this.missions.find((m) => m.id === id) || null;
  }
  fetchMember(id: number): Member | null {
    return this.members.find((m) => m.id === id) || null;
  }

}
