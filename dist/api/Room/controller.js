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
exports.createUserIdRoomChat = exports.getLastMessageRoomChat = exports.findByUserIdRoomChat = void 0;
const entities_1 = require("../../entities");
const room_model_1 = __importDefault(require("../../db/models/Room/room.model"));
const findByUserIdRoomChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guest = req.user;
    const { userId } = req.params;
    try {
        const finded = yield room_model_1.default.findOne({ include: [room_model_1.default.associations.owner_user, room_model_1.default.associations.second_user, room_model_1.default.associations.chat], where: { owner_user_id: guest === null || guest === void 0 ? void 0 : guest.id, second_user_id: userId } });
        if (finded) {
            res.json({ data: finded.get() });
        }
        else {
            res.json({ status: 404, message: "Not found Room" });
        }
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
exports.findByUserIdRoomChat = findByUserIdRoomChat;
const getLastMessageRoomChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstId, secondId } = req.params;
        if (firstId && secondId) {
            const findedRoom = yield entities_1.Room.findRoomByUserId(Number(firstId), Number(secondId));
            if (findedRoom === null || findedRoom === void 0 ? void 0 : findedRoom.chat) {
                const chat = findedRoom.chat;
                const lastMessage = chat[chat.length - 1];
                res.status(200).json({ data: lastMessage });
            }
            else {
                res.status(404).json({ status: 404, message: "Not found in this room_chat" });
            }
        }
        else {
            res.status(500).json({ status: 500, message: "Provide pls ops Id's" });
        }
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
});
exports.getLastMessageRoomChat = getLastMessageRoomChat;
const createUserIdRoomChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdRoom = yield room_model_1.default.create(Object.assign({}, req.body));
        res.json({ data: createdRoom.get() });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
exports.createUserIdRoomChat = createUserIdRoomChat;
