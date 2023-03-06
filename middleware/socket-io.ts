import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { Store as SessionStorage } from "express-session"
import RoomModel from "../db/models/Room/room.model";

export interface IServerToClientEvents {
    roomChatConnected: ({ owner_user_id, second_user_id }: { owner_user_id: number, second_user_id: number }) => void
    session: ({ userId }: { userId: string }) => void
    fetchDataRoomChat: ({ room }: { room: RoomModel }) => void
    privateMessage: (callback: any) => void
}

export interface IClientToServerEvents {
    joinRoom: (room: string) => void,
    leaveRoom: (room: string) => void,
    privateMessage: (callback: any) => void,
}

export interface IInterServerEvents {
    ping: () => void
}

export interface ISocketData {
    owner_user_id: number
    second_user_id: number
    userId: string
    nickName: string
}

class InMemorySessionStore {
    sessions: Map<any, any>

    constructor() {
        this.sessions = new Map()
    }

    findSession(id: any) {
        return this.sessions.get(id);
    }

    saveSession(id: any, session: any) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

const Store = new InMemorySessionStore()

export default function socketIoMiddlewares(io: Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>) {
    io.use((socket, next) => {
        const { owner_user_id, second_user_id } = socket.handshake.auth

        // if (sessionID) {
        //     // find existing session
        //     // const session = Store.findSession(sessionID)
        //     // if (session) {
        //     socket.sessionID = sessionID
        //     socket.userID = owner_user_id
        //     socket.nickName = nickName
        //     socket.owner_user_id = owner_user_id
        //     socket.second_user_id = second_user_id
        //     return next()
        //     // }
        // }

        // if (!nickName) {
        //     return next(new Error("invalid nickName"))
        // }
        // socket.sessionID = randomUUID()

        socket.data.userId = randomUUID()
        // socket.data.nickName = nickName
        socket.data.owner_user_id = owner_user_id
        socket.data.second_user_id = second_user_id
        next()
    })
}