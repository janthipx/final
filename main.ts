
import { Leader } from "../Leader";
import { Member } from "../Final/Member";
import { MissionStatus } from "../Final/enum";
import { ConcreteMission } from "../ConcreteMission";
import { Database } from "../Databese";
import { Score, ScoreResult } from "../Score";


// สร้าง Leader
const leader = new Leader(1, "Alice");

// สร้าง Mission
const mission: ConcreteMission = {
    id: 1,
    name: "Rescue Operation",
    leader: leader,
    members: [],
    status: MissionStatus.NotStarted,
    startMission() {
        this.status = MissionStatus.InProgress;
    },

    finishMission() {
        this.status = MissionStatus.Finished;
    },
    addMember: function (member: Member): void {
        throw new Error("Function not implemented.");
    },
    removeMember: function (member: Member): void {
        throw new Error("Function not implemented.");
    }
};

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
const score1 = new Score(member1.id, mission.id, 85, ScoreResult.Pass, true);
const score2 = new Score(member2.id, mission.id, 45, ScoreResult.Fail, false);
db.saveScore(score1);
db.saveScore(score2);
console.log(`Member ${member1.name} scored: ${score1.calculateScore()} (${score1.result})`);
console.log(`Member ${member2.name} scored: ${score2.calculateScore()} (${score2.result})`);
