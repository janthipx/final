import { User, Role } from "./final.ts";
import { Mission } from "./final";
import { Database } from "./final";
import { MessageType } from "./final";
import { ChatRoom } from "./final";

// ==================== USERS ====================
const alice = new User("u1", "Alice", Role.Leader);
const bob = new User("u2", "Bob", Role.Member);
const charlie = new User("u3", "Charlie", Role.Member);

// ==================== DATABASE ====================
const db = new Database();
db.addUser(alice);
db.addUser(bob);
db.addUser(charlie);

// ==================== CREATE MISSIONS ====================
const bankHeist = new Mission("m1", "ปล้นธนาคาร", alice);
const soccerGame = new Mission("m2", "ไปเตะบอล", bob);
const huaHinTrip = new Mission("m3", "ไปเที่ยวหัวหิน", charlie);

db.addMission(bankHeist);
db.addMission(soccerGame);
db.addMission(huaHinTrip);

// ==================== JOIN MISSIONS ====================
bob.joinMission(bankHeist);
charlie.joinMission(bankHeist);

alice.joinMission(soccerGame);
charlie.joinMission(soccerGame);

alice.joinMission(huaHinTrip);
bob.joinMission(huaHinTrip);

// ==================== SEND MESSAGES ====================
alice.sendMessage(bankHeist, "พร้อมแล้วทุกคน?");
bob.sendMessage(bankHeist, "พร้อมครับ!");
charlie.sendMessage(bankHeist, "โอเค!");

alice.sendMessage(soccerGame, "เจอกันที่สนาม 18.00 น."); 
charlie.sendMessage(soccerGame, "รับทราบครับ!");

alice.sendMessage(huaHinTrip, "ออกเดินทางวันเสาร์นะครับ");
bob.sendMessage(huaHinTrip, "โอเค ขอบคุณสำหรับข้อมูล");

// ==================== FUNCTION: PRINT USER CHAT HISTORY ====================
function printUserChatHistory(user: User) {
  console.log(`\n=== Chat history for ${user.name} ===`);
  
  user.history.missionsJoined.forEach(mission => {
    console.log(`-- Mission: ${mission.name} --`);
    mission.chatRoom.getHistory()
      .filter(msg => msg.sender.id === user.id)
      .forEach(msg => {
        console.log(`[${msg.timestamp.toISOString()}] ${msg.sender.name}: ${msg.content} (${msg.type})`);
      });
  });
}

// ==================== PRINT HISTORY ====================
printUserChatHistory(alice);
printUserChatHistory(bob);
printUserChatHistory(charlie);
