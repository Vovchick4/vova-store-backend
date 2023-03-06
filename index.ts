import http from "http"
import cors from "cors"
import dotenv from 'dotenv'
import passport from 'passport'
import { Server, Socket } from "socket.io"
import express, { Express } from 'express';
import bodyParser from 'body-parser'

import api from './api';
import sqlConnect from './db/index'
import { Room, User } from "./entities"
import Chat from "./db/models/Chat/chat.model"
import UserModel from "./db/models/User/user.model"
import initStrategy from './middleware/passport-strategy'
import { randomUUID } from "crypto"
import socketIoMiddlewares, { IClientToServerEvents, IInterServerEvents, IServerToClientEvents, ISocketData } from "./middleware/socket-io"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

const server = http.createServer(app)
const io = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>(server, { cors: { origin: "http://localhost:5173" } })

function boostrap() {
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

  socketIoMiddlewares(io)
  io.on('connection', async (socket) => {
    const { owner_user_id, second_user_id, userId } = socket.data
    if (!owner_user_id || !second_user_id || !userId) return

    // const rooms_chats = []
    const room = await Room.findRoomByUserId(owner_user_id, second_user_id)

    socket.broadcast.emit("roomChatConnected", { owner_user_id, second_user_id })

    socket.emit("session", {
      userId,
    });

    // notify existing users
    // if (room) {
    // }

    // socket.join(String(second_user_id))
    // console.log(socket.id)

    // const rooms_ids: string[] = []
    for await (let [id, socket] of io.of("/").sockets) {
      console.log(id);
      await User.setSocketIdUser(second_user_id, id)
      // rooms_ids.push(id)
      // console.log(id, socket.rooms)
      // if (socket.handshake.auth.second_user_id === second_user_id) {
      //   // io.sockets.socketsJoin(socket.id
      //   // socket
      //   // socket.emit("take second user socketID", { socketID: id })
      // }
    }

    if (room) {
      // Fetch Data From Models
      // socket.emit("fetch data room chat", { socketID: socket.id, room: room ? { ...room.get() } : null })
      socket.join(room.id.toString())
      socket.emit("fetchDataRoomChat", { ...room.get() })
    }

    // Присоединение к приватной комнате
    socket.on('joinRoom', (room: string) => {
      io.sockets.socketsJoin(room)
      console.log('user joined room: ' + room);
    });


    // Покидание приватной комнаты
    socket.on('leaveRoom', (room: string) => {
      socket.leave(room);
      console.log('user left room: ' + room)
    })

    // const firstUserSocketId = await User.getSocketIdUser(owner_user_id)
    // const secondUserSocketId = await User.getSocketIdUser(second_user_id)
    // io.sockets.socketsJoin(secondUserSocketId)

    // Send Messages Logic Setup
    socket.on("privateMessage", async ({ message, nickName: userName, to }: { message: string, nickName: string, to: any }) => {
      console.log(socket.id)
      if (!room) {
        const { id } = await Room.createRoom({ owner_user_id, second_user_id })
        const { id: created_chat_id, send_user_id } = await Chat.createMessage({ nickName: userName, message, room_id: id, send_user_id: owner_user_id, })

        socket.emit("privateMessage", {
          id: created_chat_id,
          send_user_id,
          nickName: userName,
          message,
          room_id: id,
          from: id.toString(),
        })

        socket.to(id.toString()).emit("privateMessage", {
          id: created_chat_id,
          send_user_id,
          nickName: userName,
          message,
          room_id: id,
          from: id.toString(),
        })
      } else {
        const { id: created_chat_id, send_user_id } = await Chat.createMessage({ nickName: userName, message, room_id: room.id, send_user_id: owner_user_id, })

        socket.emit("privateMessage", {
          id: created_chat_id,
          send_user_id,
          nickName: userName,
          message,
          room_id: room.id,
          from: room.id.toString(),
        })

        socket.to(room.id.toString()).emit("privateMessage", {
          id: created_chat_id,
          send_user_id,
          nickName: userName,
          message,
          room_id: room.id,
          from: room.id.toString(),
        })
      }
    })

    // socket.on('disconnect', () => {
    //   console.log('🔥: A user disconnected');
    // });
  })

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  });
}

sqlConnect(boostrap)
