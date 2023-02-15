import { Express } from "express"

import userRouter from "./User"
import itemRouter from "./Item"
import RoomRouter from "./Room"
import ChatRouter from "./Chat"
import FriendRouter from "./Friend"

export default function api(app: Express) {
    app.use("/auth", userRouter)
    app.use("/items", itemRouter)
    app.use("/room/", RoomRouter)
    app.use("/chat/", ChatRouter)
    app.use("/friend/", FriendRouter)
}