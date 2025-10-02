import { Mission } from "./Mission";
import { Member } from "./Member";
import { Leader } from "./Leader";
import { User } from "./User";

export class Database {
  private missions: Mission[] = [];
  private members: Member[] = [];
  private leaders: Leader[] = [];
  private users: User[] = []; // เพิ่ม User storage

  // ===== Mission =====
  saveMission(mission: Mission): void {
    this.missions.push(mission);
  }

  deleteMission(id: number): void {
    this.missions = this.missions.filter((m) => m.id !== id);
  }

  fetchMission(id: number): Mission | null {
    return this.missions.find((m) => m.id === id) || null;
  }

  getMissions(): Mission[] {
    return this.missions;
  }

  // ===== Member =====
  saveMember(member: Member): void {
    this.members.push(member);
  }

  fetchMember(id: number): Member | null {
    return this.members.find((m) => m.id === id) || null;
  }

  getMembers(): Member[] {
    return this.members;
  }

  // ===== Leader =====
  saveLeader(leader: Leader): void {
    this.leaders.push(leader);
  }

  fetchLeader(id: number): Leader | null {
    return this.leaders.find((l) => l.id === id) || null;
  }

  getLeaders(): Leader[] {
    return this.leaders;
  }

  // ===== User =====
  saveUser(user: User): void {
    this.users.push(user);
  }

  fetchUser(id: number): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  getUsers(): User[] {
    return this.users;
  }
}
