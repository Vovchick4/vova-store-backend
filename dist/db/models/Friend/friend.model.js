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
const user_model_1 = __importDefault(require("../User/user.model"));
class Friend extends sequelize_1.Model {
    static acceptFriend({ owner_user_id, invated_friend_id }, onSuccess = () => { }, onError = () => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            const finded = yield this.findOne({
                include: [this.associations.owner_user, this.associations.invated_friend_id],
                where: { [sequelize_1.Op.and]: [{ owner_user_id }, { invated_friend_id }] }
            });
            if (finded) {
                if (finded.accepted_friend) {
                    const updated = yield finded.update({ acceptFriend: Date.now().toLocaleString() });
                    onSuccess(updated);
                }
                onError("AlreadyAccepted");
            }
            else {
                onError("NotFound");
            }
        });
    }
    static createFriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(Object.assign({}, data));
        });
    }
    static findMyFriends({ owner_user_id, invated_friend_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll({ include: [this.associations.owner_user, this.associations.invated_friend_id], where: { [sequelize_1.Op.or]: [{ owner_user_id }, { invated_friend_id }] } });
        });
    }
}
Friend.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    owner_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNull: false
        }
    },
    invated_friend_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNull: false
        }
    },
    accepted_friend: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    }
}, { sequelize: index_1.sequelize, tableName: "Friend" });
Friend.sync({}).then(() => {
    Friend.belongsTo(user_model_1.default, { as: "owner_user", foreignKey: "owner_user_id" });
    Friend.belongsTo(user_model_1.default, { as: "invated_friend", foreignKey: "invated_friend_id" });
}).catch(err => console.log(err));
exports.default = Friend;
