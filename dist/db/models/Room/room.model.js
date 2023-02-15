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
const index_1 = require("../../index");
const chat_model_1 = __importDefault(require("../Chat/chat.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
class Room extends sequelize_1.Model {
    static createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(Object.assign({}, data));
        });
    }
    static findRoomByUserId(owner_user_id, second_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ include: [this.associations.chat, this.associations.owner_user, this.associations.second_user], where: { owner_user_id, second_user_id } });
        });
    }
}
Room.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    owner_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    second_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
    // RoomId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    // chatId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Chat,
    //         key: "chatId"
    //     }
    // }
    // chat_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // }
}, { sequelize: index_1.sequelize, tableName: "Room" });
Room.hasMany(chat_model_1.default, { as: "chat", foreignKey: "room_id" });
Room.sync({}).then(() => {
    Room.belongsTo(user_model_1.default, { as: "owner_user", foreignKey: "owner_user_id" });
    Room.belongsTo(user_model_1.default, { as: "second_user", foreignKey: "second_user_id" });
}).catch(err => console.log(err));
exports.default = Room;
