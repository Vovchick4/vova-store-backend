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
const sequelize_1 = require("sequelize");
const room_model_1 = __importDefault(require("../db/models/Room/room.model"));
class Room {
    static createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield room_model_1.default.create(Object.assign({}, data));
        });
    }
    static findRoomByUserId(owner_user_id, second_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield room_model_1.default.findOne({ include: [room_model_1.default.associations.chat, room_model_1.default.associations.owner_user, room_model_1.default.associations.second_user], where: { [sequelize_1.Op.or]: [{ owner_user_id, second_user_id }, { owner_user_id: second_user_id, second_user_id: owner_user_id }] } });
        });
    }
}
exports.default = Room;
