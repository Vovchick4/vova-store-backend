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
const room_model_1 = __importDefault(require("../Room/room.model"));
const chat_model_1 = __importDefault(require("../Chat/chat.model"));
const index_1 = require("../../index");
class User extends sequelize_1.Model {
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.create(Object.assign({}, data));
        });
    }
    static findUsersBySearchText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findAll({ where: index_1.sequelize.where(index_1.sequelize.fn('LOWER', index_1.sequelize.col('nickName')), 'LIKE', '%' + text.split(" ").join("").toLowerCase() + '%') });
        });
    }
}
User.init({
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
    sequelize: index_1.sequelize
});
// User.hasMany(Room)
// User.hasMany(Chat)
User.sync({}).then(() => __awaiter(void 0, void 0, void 0, function* () {
    User.hasMany(chat_model_1.default, { as: "chat_message", foreignKey: "send_user_id" });
    User.hasMany(room_model_1.default, { as: "owner_user", foreignKey: "owner_user_id" });
    User.hasMany(room_model_1.default, { as: "second_user", foreignKey: "second_user_id" });
})).catch(err => console.log(err));
exports.default = User;
