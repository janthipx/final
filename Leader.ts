import { Mission } from "./Mission";
import { User } from "./User";


export class Leader extends User {
  constructor(public id: number, public name: string) {
    super(id, name);
  }

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
