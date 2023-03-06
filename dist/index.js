"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_1 = __importDefault(require("./api"));
const index_1 = __importDefault(require("./db/index"));
const entities_1 = require("./entities");
const chat_model_1 = __importDefault(require("./db/models/Chat/chat.model"));
const passport_strategy_1 = __importDefault(require("./middleware/passport-strategy"));
const socket_io_2 = __importDefault(require("./middleware/socket-io"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:5173" } });
function boostrap() {
    // CORS
    app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
    // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(express_1.default.urlencoded({ extended: true }));
    // Parse JSON bodies (as sent by API clients)
    app.use(body_parser_1.default.json());
    // Init Passport
    app.use(passport_1.default.initialize());
    (0, passport_strategy_1.default)(passport_1.default);
    (0, api_1.default)(app);
    (0, socket_io_2.default)(io);
    io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const { owner_user_id, second_user_id, userId } = socket.data;
        if (!owner_user_id || !second_user_id || !userId)
            return;
        // const rooms_chats = []
        const room = yield entities_1.Room.findRoomByUserId(owner_user_id, second_user_id);
        socket.broadcast.emit("roomChatConnected", { owner_user_id, second_user_id });
        socket.emit("session", {
            userId,
        });
        try {
            // notify existing users
            // if (room) {
            // }
            // socket.join(String(second_user_id))
            // console.log(socket.id)
            // const rooms_ids: string[] = []
            for (var _d = true, _e = __asyncValues(io.of("/").sockets), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    let [id, socket] = _c;
                    console.log(id);
                    yield entities_1.User.setSocketIdUser(second_user_id, id);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (room) {
            // Fetch Data From Models
            // socket.emit("fetch data room chat", { socketID: socket.id, room: room ? { ...room.get() } : null })
            socket.join(room.id.toString());
            socket.emit("fetchDataRoomChat", Object.assign({}, room.get()));
        }
        // Присоединение к приватной комнате
        socket.on('joinRoom', (room) => {
            io.sockets.socketsJoin(room);
            console.log('user joined room: ' + room);
        });
        // Покидание приватной комнаты
        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log('user left room: ' + room);
        });
        // const firstUserSocketId = await User.getSocketIdUser(owner_user_id)
        // const secondUserSocketId = await User.getSocketIdUser(second_user_id)
        // io.sockets.socketsJoin(secondUserSocketId)
        // Send Messages Logic Setup
        socket.on("privateMessage", ({ message, nickName: userName, to }) => __awaiter(this, void 0, void 0, function* () {
            console.log(socket.id);
            if (!room) {
                const { id } = yield entities_1.Room.createRoom({ owner_user_id, second_user_id });
                const { id: created_chat_id, send_user_id } = yield chat_model_1.default.createMessage({ nickName: userName, message, room_id: id, send_user_id: owner_user_id, });
                socket.emit("privateMessage", {
                    id: created_chat_id,
                    send_user_id,
                    nickName: userName,
                    message,
                    room_id: id,
                    from: id.toString(),
                });
                socket.to(id.toString()).emit("privateMessage", {
                    id: created_chat_id,
                    send_user_id,
                    nickName: userName,
                    message,
                    room_id: id,
                    from: id.toString(),
                });
            }
            else {
                const { id: created_chat_id, send_user_id } = yield chat_model_1.default.createMessage({ nickName: userName, message, room_id: room.id, send_user_id: owner_user_id, });
                socket.emit("privateMessage", {
                    id: created_chat_id,
                    send_user_id,
                    nickName: userName,
                    message,
                    room_id: room.id,
                    from: room.id.toString(),
                });
                socket.to(room.id.toString()).emit("privateMessage", {
                    id: created_chat_id,
                    send_user_id,
                    nickName: userName,
                    message,
                    room_id: room.id,
                    from: room.id.toString(),
                });
            }
        }));
        // socket.on('disconnect', () => {
        //   console.log('🔥: A user disconnected');
        // });
    }));
    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
(0, index_1.default)(boostrap);
