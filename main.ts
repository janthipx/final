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

// ----- Create Mission (Leader) -----
async function createMission(user: User): Promise<void> {
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

  console.log(`Mission "${missionName}" created with ID ${missionId} (Leader: ${leader.name})`);
}

// ----- Join Mission (Member) -----
async function joinMission(user: User): Promise<void> {
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

  const existingMember = mission.getMembers().find((m) => m.id === user.id);
  if (existingMember) {
    console.log("You already joined this mission.");
    return;
  }

  const member = new Member(user.id, user.name, MemberStatus.Joined);
  db.saveMember(member);
  mission.addMember(member);

  console.log(`${member.name} joined mission ${mission.name}`);
}

// ----- Leader Menu -----
async function leaderMenu(leader: Leader) {
  let running = true;
  while (running) {
    console.log("\n=== LEADER MENU ===");
    console.log("1. Start mission");
    console.log("2. End mission");
    console.log("3. Announce mission results");
    console.log("4. List mission members");
    console.log("5. Show mission details");
    console.log("6. Delete mission");
    console.log("7. Back to main menu");

    const choice = await askQuestion("Choose an option: ");
    const missions = db.getMissions().filter((m) => m.leader.id === leader.id);

    switch (choice) {
      case "1":
        if (missions.length === 0) { console.log("You have no missions."); break; }
        missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}`));
        const startId = parseInt(await askQuestion("Enter mission ID to start: "));
        const startMission = db.fetchMission(startId);
        if (!startMission || startMission.leader.id !== leader.id) {
          console.log("Invalid mission.");
        } else {
          leader.startMission(startMission);
          console.log(`Mission "${startMission.name}" started.`);
        }
        break;

      case "2":
        if (missions.length === 0) { console.log("You have no missions."); break; }
        missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}`));
        const endId = parseInt(await askQuestion("Enter mission ID to end: "));
        const endMission = db.fetchMission(endId);
        if (!endMission || endMission.leader.id !== leader.id) {
          console.log("Invalid mission.");
        } else {
          leader.endMission(endMission);
          console.log(`Mission "${endMission.name}" ended.`);
        }
        break;

      case "3":
        console.log("Announce mission results - not implemented yet.");
        break;

      case "4":
        if (missions.length === 0) { console.log("You have no missions."); break; }
        missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}`));
        const listId = parseInt(await askQuestion("Enter mission ID: "));
        const listMission = db.fetchMission(listId);
        if (!listMission || listMission.leader.id !== leader.id) {
          console.log("Invalid mission.");
        } else {
          console.log(`Members of mission "${listMission.name}":`);
          console.log(`- ${listMission.leader.name} (Leader)`);
          listMission.getMembers().forEach((m) => console.log(`- ${m.name} (Member)`));
        }
        break;

      case "5":
        if (missions.length === 0) { console.log("You have no missions."); break; }
        missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}`));
        const detailId = parseInt(await askQuestion("Enter mission ID: "));
        const detailMission = db.fetchMission(detailId);
        if (!detailMission || detailMission.leader.id !== leader.id) {
          console.log("Invalid mission.");
        } else {
          console.log(`\n=== Mission Details ===`);
          console.log(`ID: ${detailMission.id}`);
          console.log(`Name: ${detailMission.name}`);
          console.log(`Status: ${detailMission.status}`);
          console.log(`Leader: ${detailMission.leader.name}`);
          console.log("Members:");
          console.log(`- ${detailMission.leader.name} (Leader)`);
          detailMission.getMembers().forEach((m) => console.log(`- ${m.name} (Member)`));
        }
        break;

      case "6":
        if (missions.length === 0) { console.log("You have no missions."); break; }
        missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}`));
        const delId = parseInt(await askQuestion("Enter mission ID to delete: "));
        const delMission = db.fetchMission(delId);
        if (!delMission || delMission.leader.id !== leader.id) {
          console.log("Invalid mission.");
        } else {
          db.deleteMission(delId);
          console.log(`Mission "${delMission.name}" deleted.`);
        }
        break;

      case "7":
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
    console.log("3. Create Mission (Become Leader)");
    console.log("4. Join Mission (Become Member)");
    console.log("5. Leader Actions");
    console.log("6. List All Missions");
    console.log("7. Exit");

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
        await createMission(currentUser);
        break;
      case "4":
        if (!currentUser) { console.log("Please login first."); break; }
        await joinMission(currentUser);
        break;
      case "5":
        if (!currentUser) { console.log("Please login first."); break; }
        const leader = db.fetchLeader(currentUser.id);
        if (!leader) console.log("You are not a leader of any mission.");
        else await leaderMenu(leader);
        break;
      case "6":
        const missions = db.getMissions();
        if (missions.length === 0) console.log("No missions available.");
        else missions.forEach((m) => console.log(`ID: ${m.id}, Name: ${m.name}, Status: ${m.status}, Leader: ${m.leader.name}, Members: ${m.getMembers().length}`));
        break;
      case "7":
        console.log("Goodbye!");
        running = false;
        rl.close();
        break;
      default:
        console.log("Invalid option.");
    }
  }
}

main().catch((err) => { console.error(err); rl.close(); });
