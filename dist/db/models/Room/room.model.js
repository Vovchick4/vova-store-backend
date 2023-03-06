"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
const user_model_1 = __importDefault(require("../User/user.model"));
class RoomModel extends sequelize_1.Model {
}
RoomModel.init({
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
user_model_1.default.hasMany(RoomModel, { as: "owner_rooms", foreignKey: "owner_user_id" });
user_model_1.default.hasMany(RoomModel, { as: "second_user", foreignKey: "second_user_id" });
RoomModel.belongsTo(user_model_1.default, { as: "owner_user", foreignKey: "owner_user_id" });
RoomModel.belongsTo(user_model_1.default, { as: "second_user", foreignKey: "second_user_id" });
RoomModel.sync({}).then(() => { }).catch(err => console.log(err));
exports.default = RoomModel;
