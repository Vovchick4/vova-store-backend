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
const passport_strategy_1 = __importDefault(require("./middleware/passport-strategy"));
const room_model_1 = __importDefault(require("./db/models/Room/room.model"));
const chat_model_1 = __importDefault(require("./db/models/Chat/chat.model"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:5173" } });
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
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner_user_id, second_user_id, nickName } = socket.handshake.auth;
    const room = yield room_model_1.default.findRoomByUserId(owner_user_id, second_user_id);
    if (room) {
        // Fetch Data From Models
        socket.emit("fetch data room chat", room);
    }
    // Send Messages Logic Setup
    socket.on("private message", ({ message, nickName: userName, to }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!room) {
            const { id } = yield room_model_1.default.createRoom({ owner_user_id, second_user_id });
            const { id: created_chat_id } = yield chat_model_1.default.createMessage({ nickName: userName, message, room_id: id, send_user_id: to, });
            socket.emit("private message", {
                id: created_chat_id,
                nickName: userName,
                message,
                room_id: id,
                from: socket.id,
            });
        }
        else {
            const { id: created_chat_id } = yield chat_model_1.default.createMessage({ nickName: userName, message, room_id: room.id, send_user_id: to, });
            socket.emit("private message", {
                id: created_chat_id,
                nickName: userName,
                message,
                room_id: room.id,
                from: socket.id,
            });
        }
    }));
    // socket.on('disconnect', () => {
    //   console.log('🔥: A user disconnected');
    // });
}));
server.listen(port, () => {
    (0, index_1.default)();
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
