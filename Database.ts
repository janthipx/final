import { Mission } from "./Mission";
import { Member } from "./Member";
import { User } from "./User";
import { Leader } from "./Leader";


export class Database {
  private missions: Mission[] = [];
  private members: Member[] = [];
  private leaders: Leader[] = [];
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }
  saveUser(user: User): void {
    this.users.push(user);
  }
  
  getLeaders(): Leader[] {
    return this.leaders;
  }

  saveLeader(leader: Leader): void {
    this.leaders.push(leader);
  }

  getMissions(): Mission[] {
    return this.missions;
  }
  saveMission(mission: Mission): void {
    this.missions.push(mission);
  }
  getMembers(): Member[] {
    return this.members;
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
  
  fetchUser(id: number): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  fetchMember(id: number): Member | null {
    return this.members.find((m) => m.id === id) || null;
  }

  fetchMission(id: number): Mission | null {
    return this.missions.find((m) => m.id === id) || null;
  }

  fetchLeader(id: number): Leader | null {
    return this.leaders.find((l) => l.id === id) || null;
  }

}
