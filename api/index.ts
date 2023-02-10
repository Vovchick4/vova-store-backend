import { Express } from "express";

import userRouter from "./User/index"
import itemRouter from "./Item/index"
import RoomRouter from "./Room/index";
import ChatRouter from "./Chat/index";

export default function api(app: Express) {
    app.use("/auth", userRouter)
    app.use("/items", itemRouter)
    app.use("/room/", RoomRouter)
    app.use("/chat/", ChatRouter)
}