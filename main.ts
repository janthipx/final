import { Database } from "./Database";
import { User } from "./User";
import { Member } from "./Member";
import { Leader } from "./Leader";
import { Mission } from "./Mission";
import { MemberStatus } from "./enum";
//@ts-ignore
import * as readline from "readline";

const db = new Database();

const rl = readline.createInterface({
  //@ts-ignore
  input: process.stdin,
  //@ts-ignore
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// ----- User Management -----
async function createUser(): Promise<User> {
  const id = parseInt(await askQuestion("Enter your ID: "));
  if (db.fetchUser(id)) {
    console.log("User ID already exists.");
    return await createUser();
  }
  const name = await askQuestion("Enter your Name: ");
  const user = new User(id, name);
  db.saveUser(user);
  console.log(`User created: ${user.name} (ID: ${user.id})`);
  return user;
}

async function selectUser(): Promise<User | null> {
  const users = db.getUsers();
  if (users.length === 0) {
    console.log("No users found. Please create a user first.");
    return null;
  }
  console.log("Users:");
  users.forEach((u) => console.log(`ID: ${u.id}, Name: ${u.name}`));
  const id = parseInt(await askQuestion("Enter your User ID: "));
  const user = db.fetchUser(id);
  if (!user) console.log("User not found.");
  return user;
}

// ----- Mission Functions -----
async function createMission(user: User) {
  // ตรวจสอบว่า user เป็น leader ของ mission ไหนแล้ว
  if (db.fetchLeader(user.id)) {
    console.log("You are already a leader of a mission.");
    return;
  }

  const missionId = parseInt(await askQuestion("Enter mission ID: "));
  if (db.fetchMission(missionId)) {
    console.log("Mission ID already exists.");
    return;
  }

  const missionName = await askQuestion("Enter mission name: ");
  const leader = new Leader(user.id, user.name);
  db.saveLeader(leader);

  const mission = new Mission(missionId, missionName, leader);
  db.saveMission(mission);

  console.log(`Mission "${missionName}" created (Leader: ${leader.name})`);
}

async function joinMission(user: User) {
  const missions = db.getMissions();
  if (missions.length === 0) {
    console.log("No missions available.");
    return;
  }

  console.log("Available missions:");
  missions.forEach((m) =>
    console.log(`ID: ${m.id}, Name: ${m.name}, Leader: ${m.leader.name}, Members: ${m.getMembers().length}`)
  );

  const missionId = parseInt(await askQuestion("Enter mission ID to join: "));
  const mission = db.fetchMission(missionId);

  if (!mission) {
    console.log("Mission not found.");
    return;
  }

  if (mission.leader.id === user.id) {
    console.log("You are the leader of this mission, cannot join as member.");
    return;
  }

  if (mission.getMembers().some(m => m.id === user.id)) {
    console.log("You already joined this mission.");
    return;
  }

  const member = new Member(user.id, user.name, MemberStatus.Joined);
  db.saveMember(member);
  mission.addMember(member);

  console.log(`${member.name} joined mission "${mission.name}"`);
}

// ----- Mission Menu -----
async function missionMenu(user: User) {
  let running = true;
  while (running) {
    console.log("\n=== MISSION MENU ===");
    console.log("1. Create Mission (Leader)");
    console.log("2. Join Mission (Member)");
    console.log("3. Start Mission (Leader Only)");
    console.log("4. End Mission (Leader Only)");
    console.log("5. Show Mission Details");
    console.log("6. List All Missions");
    console.log("7. Delete Mission (Leader Only)");
    console.log("8. Back to Main Menu");

    const choice = await askQuestion("Choose an option: ");

    switch (choice) {
      case "1":
        await createMission(user);
        break;

      case "2":
        await joinMission(user);
        break;

      case "3":
        const startMissions = db.getMissions().filter(m => m.leader.id === user.id);
        if (startMissions.length === 0) { console.log("You have no missions to start."); break; }
        startMissions.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}`));
        const startId = parseInt(await askQuestion("Enter mission ID to start: "));
        const startMission = db.fetchMission(startId);
        if (startMission?.leader.id === user.id) {
          startMission.startMission();
          console.log(`Mission "${startMission.name}" started.`);
        } else console.log("Invalid mission.");
        break;

      case "4":
        const endMissions = db.getMissions().filter(m => m.leader.id === user.id);
        if (endMissions.length === 0) { console.log("You have no missions to end."); break; }
        endMissions.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}`));
        const endId = parseInt(await askQuestion("Enter mission ID to end: "));
        const endMission = db.fetchMission(endId);
        if (endMission?.leader.id === user.id) {
          endMission.finishMission();
          console.log(`Mission "${endMission.name}" ended.`);
        } else console.log("Invalid mission.");
        break;

      case "5":
        const detailId = parseInt(await askQuestion("Enter mission ID: "));
        const detailMission = db.fetchMission(detailId);
        if (!detailMission) { console.log("Mission not found."); break; }
        console.log(`\nMission "${detailMission.name}" (ID: ${detailMission.id}, Status: ${detailMission.status})`);
        console.log(`Leader: ${detailMission.leader.name}`);
        console.log("Members:");
        console.log(`- ${detailMission.leader.name} (Leader)`);
        detailMission.getMembers().forEach(m => console.log(`- ${m.name} (Member)`));
        break;

      case "6":
        const allMissions = db.getMissions();
        if (allMissions.length === 0) console.log("No missions available.");
        else allMissions.forEach(m =>
          console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}, Leader: ${m.leader.name}, Members: ${m.getMembers().length}`)
        );
        break;

      case "7":
        const delMissions = db.getMissions().filter(m => m.leader.id === user.id);
        if (delMissions.length === 0) { console.log("You have no missions to delete."); break; }
        delMissions.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}`));
        const delId = parseInt(await askQuestion("Enter mission ID to delete: "));
        const delMission = db.fetchMission(delId);
        if (delMission?.leader.id === user.id) {
          db.deleteMission(delId);
          console.log(`Mission "${delMission.name}" deleted.`);
        } else console.log("Invalid mission.");
        break;

      case "8":
        running = false;
        break;

      default:
        console.log("Invalid option.");
    }
  }
}

// ----- Main Menu -----
async function main() {
  console.log("=== Welcome to Mission Management System ===");

  let currentUser: User | null = null;
  let running = true;

  while (running) {
    console.log("\n=== MAIN MENU ===");
    console.log("1. Create User");
    console.log("2. Login User");
    console.log("3. Mission Menu");
    console.log("4. Exit");

    const choice = await askQuestion("Choose an option: ");

    switch (choice) {
      case "1":
        currentUser = await createUser();
        break;
      case "2":
        const user = await selectUser();
        if (user) currentUser = user;
        break;
      case "3":
        if (!currentUser) { console.log("Please login first."); break; }
        await missionMenu(currentUser);
        break;
      case "4":
        console.log("Goodbye!");
        running = false;
        rl.close();
        break;
      default:
        console.log("Invalid option.");
    }
  }
}

main().catch(err => { console.error(err); rl.close(); });
