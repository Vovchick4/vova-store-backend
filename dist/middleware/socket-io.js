"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class InMemorySessionStore {
    constructor() {
        this.sessions = new Map();
    }
    findSession(id) {
        return this.sessions.get(id);
    }
    saveSession(id, session) {
        this.sessions.set(id, session);
    }
    findAllSessions() {
        return [...this.sessions.values()];
    }
}
const Store = new InMemorySessionStore();
function socketIoMiddlewares(io) {
    io.use((socket, next) => {
        const { owner_user_id, second_user_id } = socket.handshake.auth;
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
        socket.data.userId = (0, crypto_1.randomUUID)();
        // socket.data.nickName = nickName
        socket.data.owner_user_id = owner_user_id;
        socket.data.second_user_id = second_user_id;
        next();
    });
}
exports.default = socketIoMiddlewares;
