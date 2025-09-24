import { Leader } from "../Leader";
import { Member } from "../Final/Member";
import { MissionStatus } from "../Final/enum";
import { ConcreteMission } from "../ConcreteMission";
import { Database } from "../Databese";
import { Score, ScoreResult } from "../Score";
import { Mission } from "../Final/Misssion";

// สร้าง Leader
const leader = new Leader(1, "Alice");

// สร้าง Mission
const mission = new ConcreteMission(1, "First Mission", leader);

// สร้าง Member
const member1 = new Member(1, "Bob");
const member2 = new Member(2, "Charlie");

// เพิ่ม Member เข้า Mission
mission.addMember(member1);
mission.addMember(member2);
console.log(
  `Mission ${mission.name} has members: ${mission.members
    .map((m: Member) => m.name)
    .join(", ")}`
);

// เริ่ม Mission
mission.startMission();
console.log(
  `Mission ${mission.name} status: ${
    MissionStatus[mission.status as keyof typeof MissionStatus]
  }`
);

// สร้าง Database
const db = new Database();
db.saveMission(mission);
db.saveMember(member1);
db.saveMember(member2);
console.log(
  `Database has ${
    db.fetchScoresByMember(member1.id).length
  } scores for member ${member1.name}`
);

// จบ Mission
mission.finishMission();
console.log(
  `Mission ${mission.name} status: ${
    MissionStatus[mission.status as keyof typeof MissionStatus]
  }`
);

// ประกาศผล
leader.announceResults(mission);

// สร้าง Score
const score1 = new Score(member1.id, mission.id, 85, ScoreResult.Pass, true);
const score2 = new Score(member2.id, mission.id, 45, ScoreResult.Fail, false);
db.saveScore(score1);
db.saveScore(score2);

console.log(
  `Member ${member1.name} scored: ${score1.calculateScore()} (${score1.result})`
);
console.log(
  `Member ${member2.name} scored: ${score2.calculateScore()} (${score2.result})`
);
