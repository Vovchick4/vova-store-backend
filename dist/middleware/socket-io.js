"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function socketIoMiddlewares(io) {
    io.use((socket, next) => {
        const { owner_user_id, second_user_id, nickName, room_id } = socket.handshake.auth;
        if (!nickName) {
            return next(new Error("invalid nickName"));
        }
        if (room_id !== undefined) {
            socket.room_id = room_id;
        }
        socket.nickName = nickName;
        socket.owner_user_id = owner_user_id;
        socket.second_user_id = second_user_id;
        next();
    });
}
exports.default = socketIoMiddlewares;
