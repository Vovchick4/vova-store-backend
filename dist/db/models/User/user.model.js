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
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
class UserModel extends sequelize_1.Model {
}
UserModel.init({
    socketId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nickName: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 20]
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            notEmpty: true,
            len: [8, 100]
        },
        set(val) {
            const salt = bcrypt_1.default.genSaltSync(10);
            this.setDataValue("password", bcrypt_1.default.hashSync(val, salt));
        },
    }
}, {
    sequelize: index_1.sequelize, tableName: "User"
});
// User.hasMany(Room)
// User.hasMany(Chat)
UserModel.sync({}).then(() => __awaiter(void 0, void 0, void 0, function* () { })).catch(err => console.log(err));
exports.default = UserModel;
