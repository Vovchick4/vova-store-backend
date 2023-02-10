import http from "http"
import cors from "cors"
import dotenv from 'dotenv'
import passport from 'passport'
import { Server } from "socket.io"
import express, { Express } from 'express';
import bodyParser from 'body-parser'

import api from './api';
import sqlConnect from './db/index'
import initStrategy from './middleware/passport-strategy'
import Room from "./db/models/Room/room.model"
import Chat from "./db/models/Chat/chat.model"
import User from "./db/models/User/user.model"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "http://localhost:5173" } })

// CORS
app.use(cors({ origin: "http://localhost:5173" }))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json())

// Init Passport
app.use(passport.initialize())
initStrategy(passport)

api(app)

io.on('connection', async (socket) => {
  const { owner_user_id, second_user_id, nickName, room_id } = socket.handshake.auth

  if (room_id !== null) {
    const fetchedRoom = await Room.findByPk(room_id)
    const fetchedUser = await User.findByPk(second_user_id)
    // Fetch Data From Models
    socket.emit("fetch data room chat", { room: fetchedRoom, user: fetchedUser })
  }

  // Send Messages Logic Setup
  socket.on("private message", async ({ message, nickName: userName, to }: { message: string, nickName: string, to: any }) => {
    if (room_id === null) {
      const { id } = await Room.createRoom({ owner_user_id, second_user_id })
      const { id: created_chat_id } = await Chat.createMessage({ nickName: userName, message, room_id: id, send_user_id: to, })

      socket.emit("private message", {
        id: created_chat_id,
        nickName: userName,
        message,
        room_id: id,
        from: socket.id,
      })
    } else {
      const { id: created_chat_id } = await Chat.createMessage({ nickName: userName, message, room_id, send_user_id: to, })

      socket.emit("private message", {
        id: created_chat_id,
        nickName: userName,
        message,
        room_id,
        from: socket.id,
      })
    }
  })

  // socket.on('disconnect', () => {
  //   console.log('🔥: A user disconnected');
  // });
})

server.listen(port, () => {
  sqlConnect()
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});