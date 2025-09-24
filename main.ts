
import { Database } from "../Databese";
import { Leader } from "../Leader";
import { Member } from "./Member";
import { ConcreteMission } from "../ConcreteMission";
import { Score } from "../Score";
import { ScoreResult } from "./enum";

// สร้าง Leader
const leader = new Leader(1, "Alice");

// สร้าง Mission
const mission = new ConcreteMission(101, "Rescue Mission", leader);

// สร้าง Member
const member1 = new Member(1, "Bob");
const member2 = new Member(2, "Charlie");

// Member join mission
member1.joinMission(mission);
member2.joinMission(mission);

// Leader start mission
console.log(leader.startMission(mission));

// สร้าง Database
const db = new Database();
db.saveMission(mission);
db.saveMember(member1);
db.saveMember(member2);

// Leader end mission
console.log(leader.endMission(mission));

// ประกาศผล
console.log(leader.announceResults(mission));

// สร้าง Score
const score1 = new Score(member1.id, mission.id, 85, ScoreResult.Success);
const score2 = new Score(member2.id, mission.id, 60, ScoreResult.Failure);

console.log(`Member ${member1.name} scored: ${score1.calculateScore()} (${score1.result})`);
console.log(`Member ${member2.name} scored: ${score2.calculateScore()} (${score2.result})`);
