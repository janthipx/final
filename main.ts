// ตัวอย่างการใช้งาน
const leader = new User("u1", "Alice", Role.Leader);
const member = new User("u2", "Bob", Role.Member);

const mission = new Mission("m1", "Rescue Mission", leader);

member.joinMission(mission);
member.sendMessage(mission, "Hello team!");
leader.sendMessage(mission, "Welcome!", MessageType.Emoji);

console.log("Chat history:");
mission.chatRoom.getHistory().forEach(msg => {
  console.log(`[${msg.timestamp.toISOString()}] ${msg.sender.name}: ${msg.content} (${msg.type})`);
});
