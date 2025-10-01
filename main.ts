import { Database } from "./Database";
import { Member } from "./Member";
import { Leader } from "./Leader";
import { Mission } from "./Mission";
import { MemberStatus } from "./enum";
import * as readline from 'readline';

const db = new Database();

// สร้าง Leader เริ่มต้น
const leader = new Leader(1, "Default Leader");
db.saveMember(leader);


// เก็บรายชื่อ Leaders ทั้งหมด
const leaders: Leader[] = [leader];

// สร้าง readline interface สำหรับรับข้อมูลจากผู้ใช้
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ฟังก์ชันสำหรับถามคำถามและรับคำตอบจากผู้ใช้
function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
}


//ฟังก์ชันแสดงเมนู สำหรับ Leader Mode
async function displayLeaderMenu(): Promise<string> {
    console.log("\n=== LEADER MODE ===");
    console.log("1. Create a new leader");
    console.log("2. Select a leader");
    console.log("3. Back to main menu");
    return await askQuestion("Choose an option: ");
}

// ฟังก์ชันแสดงเมนูหลัก
async function displayMainMenu(): Promise<string> {
    console.log("\n=== MAIN MENU ===");
    console.log("1. Leader Mode");
    console.log("2. Mission Mode");
    console.log("3. Display Mode");
    console.log("4. Exit");
    return await askQuestion("Choose an option: ");
}

// ฟังก์ชันสำหรับสร้าง Leader ใหม่
async function createLeader(): Promise<Leader> {
    const leaderId = parseInt(await askQuestion("Enter leader ID: "));
    const leaderName = await askQuestion("Enter leader name: ");
    
    const newLeader = new Leader(leaderId, leaderName);
    db.saveMember(newLeader);
    leaders.push(newLeader);
    
    console.log(`Leader ${leaderName} created with ID ${leaderId}`);
    return newLeader;
}

// ฟังก์ชันสำหรับเลือก Leader
async function selectLeader(): Promise<Leader | null> {
    console.log("\n=== SELECT LEADER ===");
    
    if (leaders.length === 0) {
        console.log("No leaders available. Please create a leader first.");
        return null;
    }
    
    console.log("Available leaders:");
    leaders.forEach((leader, index) => {
        console.log(`${index + 1}. ID: ${leader.id}, Name: ${leader.name}`);
    });
    
    const selection = parseInt(await askQuestion("Select a leader (enter number): "));
    
    if (selection > 0 && selection <= leaders.length) {
        const selectedLeader = leaders[selection - 1];
        console.log(`Selected leader: ${selectedLeader.name}`);
        return selectedLeader;
    } else {
        console.log("Invalid selection.");
        return null;
    }
}

// ฟังก์ชันแสดงเมนูสำหรับ Mission Mode
async function displayMissionMenu(): Promise<string> {
    console.log("\n=== MISSION MODE ===");
    console.log("1. Create a new mission");
    console.log("2. Add a member to a mission");
    console.log("3. Start a mission");
    console.log("4. End a mission");
    console.log("5. Announce mission results");
    console.log("6. Create a new leader");
    console.log("7. Select a leader");
    console.log("8. Back to main menu");
    return await askQuestion("Choose an option: ");
}



// ฟังก์ชันแสดงเมนูสำหรับ Display Mode
async function displayInfoMenu(): Promise<string> {
    console.log("\n=== DISPLAY MODE ===");
    console.log("1. List all missions");
    console.log("2. List mission members");
    console.log("3. Show mission details");
    console.log("4. Back to main menu");
    return await askQuestion("Choose an option: ");
}

// ฟังก์ชันจัดการ Mission Mode
async function handleMissionMode(): Promise<void> {
    let running = true;
    // ตัวแปรเก็บ Leader ที่เลือกปัจจุบัน
    let currentLeader: Leader = leader;
    
    while (running) {
        // แสดงข้อมูล Leader ที่เลือกปัจจุบัน
        console.log("\n" + "=".repeat(40));
        console.log(`Current Leader: ${currentLeader.name} (ID: ${currentLeader.id})`);
        console.log("=".repeat(40));
        
        const choice = await displayMissionMenu();
        
        switch (choice) {
            case "1": // Create a new mission
                const missionName = await askQuestion("Enter mission name: ");
                const missionId = parseInt(await askQuestion("Enter mission ID: "));
                
                const newMission = new Mission(missionId, missionName, currentLeader);
                db.saveMission(newMission);
                console.log(`Mission ${missionName} created with ID ${missionId} (Leader: ${currentLeader.name})`);
                break;
                
            case "2": // Add a member to a mission
                const missionIdToAddMember = parseInt(await askQuestion("Enter mission ID: "));
                const missionToAddMember = db.fetchMission(missionIdToAddMember);
                
                if (missionToAddMember) {
                    const memberId = parseInt(await askQuestion("Enter member ID: "));
                    const memberName = await askQuestion("Enter member name: ");
                    
                    const newMember = new Member(memberId, memberName, MemberStatus.Inactive);
                    newMember.joinMission(); // เปลี่ยนสถานะเป็น Joined
                    db.saveMember(newMember);
                    missionToAddMember.addMember(newMember);
                    
                    console.log(`Member ${memberName} added to mission ${missionToAddMember.name}`);
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "3": // Start a mission
                const missionIdToStart = parseInt(await askQuestion("Enter mission ID to start: "));
                const missionToStart = db.fetchMission(missionIdToStart);
                
                if (missionToStart) {
                    const result = currentLeader.startMission(missionToStart);
                    console.log(result);
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "4": // End a mission
                const missionIdToEnd = parseInt(await askQuestion("Enter mission ID to end: "));
                const missionToEnd = db.fetchMission(missionIdToEnd);
                
                if (missionToEnd) {
                    const result = currentLeader.endMission(missionToEnd);
                    console.log(result);
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "5": // Announce mission results
                const missionIdToAnnounce = parseInt(await askQuestion("Enter mission ID to announce results: "));
                const missionToAnnounce = db.fetchMission(missionIdToAnnounce);
                
                if (missionToAnnounce) {
                    const result = currentLeader.announceResults(missionToAnnounce);
                    console.log(result);
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "6": // Create a new leader
                const newLeader = await createLeader();
                if (newLeader) {
                    currentLeader = newLeader;
                    console.log(`Current leader changed to ${currentLeader.name}`);
                }
                break;
                
            case "7": // Select a leader
                const selectedLeader = await selectLeader();
                if (selectedLeader) {
                    currentLeader = selectedLeader;
                    console.log(`Current leader changed to ${currentLeader.name}`);
                }
                break;
                
            case "8": // Back to main menu
                running = false;
                break;
                
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}

// ฟังก์ชันจัดการ Display Mode
async function handleDisplayMode(): Promise<void> {
    let running = true;
    while (running) {
        const choice = await displayInfoMenu();
        
        switch (choice) {
            case "1": // List all missions
                const missions = db.getMissions();
                console.log("\n=== ALL MISSIONS ===");
                
                if (missions.length === 0) {
                    console.log("No missions found.");
                } else {
                    missions.forEach(mission => {
                        console.log(`ID: ${mission.id}, Name: ${mission.name}, Status: ${mission.status}`);
                    });
                }
                break;
                
            case "2": // List mission members
                const missionIdForMembers = parseInt(await askQuestion("Enter mission ID: "));
                const missionForMembers = db.fetchMission(missionIdForMembers);
                
                if (missionForMembers) {
                    const members = missionForMembers.getMembers();
                    console.log(`\n=== MEMBERS OF MISSION: ${missionForMembers.name} ===`);
                    
                    if (members.length === 0) {
                        console.log("No members in this mission.");
                    } else {
                        members.forEach(member => {
                            console.log(`ID: ${member.id}, Name: ${member.name}, Status: ${member.status}`);
                        });
                    }
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "3": // Show mission details
                const missionIdForDetails = parseInt(await askQuestion("Enter mission ID: "));
                const missionForDetails = db.fetchMission(missionIdForDetails);
                
                if (missionForDetails) {
                    console.log(`\n=== MISSION DETAILS: ${missionForDetails.name} ===`);
                    console.log(`ID: ${missionForDetails.id}`);
                    console.log(`Name: ${missionForDetails.name}`);
                    console.log(`Status: ${missionForDetails.status}`);
                    console.log(`Leader: ${missionForDetails.leader.name}`);
                    console.log(`Number of members: ${missionForDetails.getMembers().length}`);
                } else {
                    console.log("Mission not found");
                }
                break;
                
            case "4": // Back to main menu
                running = false;
                break;
                
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}

// ฟังก์ชันจัดการ Leader Mode
async function handleLeaderMode(): Promise<void> {
    let running = true;
    
    while (running) {
        const choice = await displayLeaderMenu();
        
        switch (choice) {
            case "1": // Create a new leader
                const newLeader = await createLeader();
                console.log(`New leader created: ${newLeader.name} (ID: ${newLeader.id})`);
                break;
                
            case "2": // Select a leader
                const selectedLeader = await selectLeader();
                if (selectedLeader) {
                    console.log(`Selected leader: ${selectedLeader.name} (ID: ${selectedLeader.id})`);
                }
                break;
                
            case "3": // Back to main menu
                running = false;
                break;
                
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}

// ฟังก์ชันหลักสำหรับเริ่มต้นโปรแกรม
async function main(): Promise<void> {
    let running = true;
    
    console.log("Welcome to Mission Management System");
    
    while (running) {
        const choice = await displayMainMenu();
        
        switch (choice) {
            case "1": // Leader Mode
                await handleLeaderMode();
                break;
                
            case "2": // Mission Mode
                await handleMissionMode();
                break;
                
            case "3": // Display Mode
                await handleDisplayMode();
                break;
                
            case "4": // Exit
                console.log("Thank you for using Mission Management System. Goodbye!");
                running = false;
                rl.close();
                break;
                
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}

// เริ่มต้นโปรแกรม
main().catch(error => {
    console.error("An error occurred:", error);
    rl.close();
});
