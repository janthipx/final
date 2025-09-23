// ==================== ENUMS ====================
class Role {
  static Leader = "Leader";
  static Member = "Member";
}

class MessageType {
  static Text = "text";
  static Emoji = "emoji";
  static Sticker = "sticker";
}

class MissionStatus {
  static Waiting = "waiting";
  static InProgress = "inProgress";
  static Ended = "ended";
}

// ==================== INTERFACE ====================
interface IActionable {
  joinMission(mission: Mission): void;
  leaveMission(mission: Mission): void;
  notify(message: string): void;
  sendMessage(mission: Mission, content: string, type?: MessageType): void;
}

class User implements IActionable {
  constructor(
    public id: string,
    public name: string,
    public role: Role,
    public history: UserHistory = new UserHistory()
  ) {}

  joinMission(mission: Mission): void {
    mission.addMember(this);
    this.history.missionsJoined.push(mission);
  }

  leaveMission(mission: Mission): void {
    mission.removeMember(this);
    this.history.missionsJoined = this.history.missionsJoined.filter(m => m.id !== mission.id);
  }

  notify(message: string): void {
    console.log(`🔔 [${this.name}] ${message}`);
  }

   sendMessage(mission: Mission, content: string, type?: MessageType): void;
    sendMessage(mission: Mission, content: string, type: MessageType = MessageType.Text): void {
        if (mission.chatRoom) {
            mission.chatRoom.sendMessage(this, content, type);
        }
    }
}

// ==================== MESSAGE ====================
class Message {
  constructor(
    public sender: User,
    public content: string,
    public type: MessageType,
    public timestamp: Date = new Date()
  ) {}
}


class Mission {
  public members: User[] = [];
  public chatRoom: ChatRoom;

  constructor(
    public id: string,
    public name: string,
    public leader: User,
    public status: MissionStatus = MissionStatus.Waiting,
    public maxMembers: number = 10,
    public inviteCode: string = Math.random().toString(36).substring(2, 8)
  ) {
    this.members.push(leader); // เพิ่ม leader เป็นสมาชิกทันที
    this.chatRoom = new ChatRoom(this);
    leader.history.missionsCreated.push(this);
    this.notifyAll(`${leader.name} has created the mission.`);
  }

 addMember(user: User): void {
  if (this.members.some(m => m.id === user.id)) {
    console.log(`${user.name} is already in the mission.`);
    return;
  }

  if (this.members.length < this.maxMembers) {
    this.members.push(user);
    this.notifyAll(`${user.name} has joined the mission.`);
  } else {
    console.log("Mission is full!");
  }
}
  removeMember(user: User): void {
    this.members = this.members.filter(m => m.id !== user.id);
    this.notifyAll(`${user.name} has left the mission.`);
  }
  notifyAll(message: string): void {
    this.members.forEach(member => member.notify(message));
  }
}

class ChatRoom {
  protected messages: Message[] = [];

  constructor(protected mission: Mission) {}

    sendMessage(sender: User, content: string, type: MessageType = MessageType.Text): void {
    const message = new Message(sender, content, type);
    this.messages.push(message);
    this.mission.notifyAll(`[${sender.name}] ${content}`);
  }
  getHistory(): Message[] {
    return this.messages;
  }
}

// ==================== DATABASE ====================
class Database {
    users: Map<string, User> = new Map();   
    missions: Map<string, Mission> = new Map();

    addUser(user: User): void {
        this.users.set(user.id, user);
    }

    addMission(mission: Mission): void {
        this.missions.set(mission.id, mission);
    }
}

// ==================== USER HISTORY ====================
class UserHistory {
  missionsJoined: Mission[] = [];
  missionsCreated: Mission[] = [];

  getHistory(): Mission[] {
  return [...this.missionsJoined, ...this.missionsCreated];
}
}
