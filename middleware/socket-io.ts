import { Socket } from "socket.io";

export default function socketIoMiddlewares(io: Socket) {
    io.use((socket: any, next: any) => {
        const { owner_user_id, second_user_id, nickName } = socket.handshake.auth
        if (!nickName) {
            return next(new Error("invalid nickName"))
        }
        socket.nickName = nickName
        socket.owner_user_id = owner_user_id
        socket.second_user_id = second_user_id
        next()
    })
}