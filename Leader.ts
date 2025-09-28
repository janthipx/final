import { Mission } from "./Misssion";


export class Leader {
  constructor(public id: number, public name: string) {}

  startMission(mission: Mission): string {
    mission.startMission();
    return `Leader ${this.name} started mission ${mission.name}`;
  }

  endMission(mission: Mission): string {
    mission.finishMission();
    return `Leader ${this.name} ended mission ${mission.name}`;
  }

  announceResults(mission: Mission): string {
    return `Results announced for mission ${mission.name}`;
  }
}
