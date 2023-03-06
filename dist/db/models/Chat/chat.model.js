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
const room_model_1 = __importDefault(require("../Room/room.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
class Chat extends sequelize_1.Model {
    // // define association here
    // static associate(models: { User: ModelStatic<Model<any, any>>; Room: ModelStatic<Model<any, any>> }) {
    //     Chat.belongsTo(models.User, { as: "User" })
    //     Chat.belongsTo(models.Room, { as: "Room", foreignKey: "roomId" })
    // }
    static createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(Object.assign({}, data));
        });
    }
}
Chat.init({
    // chatId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    // roomRoomId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Room,
    //         key: "roomRoomId"
    //     }
    // },
    nickName: {
        type: sequelize_1.DataTypes.STRING,
    },
    room_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    send_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { sequelize: index_1.sequelize, tableName: "Chat" });
user_model_1.default.hasMany(Chat, { as: "chat_message", foreignKey: "send_user_id" });
Chat.belongsTo(user_model_1.default, { as: "user_message", foreignKey: "send_user_id" });
room_model_1.default.hasMany(Chat, { as: "chat", foreignKey: "room_id" });
Chat.belongsTo(room_model_1.default, { as: "room", foreignKey: "room_id" });
Chat.sync({}).then(() => {
    // Chat.belongsTo(User, { as: "User" })
    // Chat.belongsTo(Room, { 
    //     foreignKey: {
    //         field: "room_id",
    //         allowNull: false,
    //     },
    //     targetKey: "id",
    //     as: "room"
    // })
}).catch(err => console.log(err));
exports.default = Chat;
