import { Mission } from "./Final/Misssion";
import { Leader } from "./Leader";
import { Member } from "./Final/Member";
import { MissionStatus } from "./Final/enum";

export interface ConcreteMission extends Mission {
  id: number;
  name: string;
  leader: Leader;
  
}
