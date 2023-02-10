"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
const user_model_1 = __importDefault(require("../User/user.model"));
const room_model_1 = __importDefault(require("../Room/room.model"));
class Chat extends sequelize_1.Model {
}
Chat.init({
    message: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { sequelize: index_1.sequelize });
Chat.belongsTo(user_model_1.default);
Chat.belongsTo(room_model_1.default);
Chat.sync({}).then(() => {
}).catch(err => console.log(err));
exports.default = Chat;
