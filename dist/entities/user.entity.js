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
const sequelize_1 = __importDefault(require("sequelize"));
const user_model_1 = __importDefault(require("../db/models/User/user.model"));
class User {
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.create(Object.assign({}, data));
        });
    }
    static setSocketIdUser(id, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedUser = yield user_model_1.default.findByPk(id);
            if (findedUser) {
                yield findedUser.update({ socketId });
            }
        });
    }
    static getSocketIdUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedUser = yield user_model_1.default.findByPk(id);
            return yield (findedUser === null || findedUser === void 0 ? void 0 : findedUser.get().socketId);
        });
    }
    static findUsersBySearchText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findAll({ where: sequelize_1.default.where(sequelize_1.default.fn('LOWER', sequelize_1.default.col('nickName')), 'LIKE', '%' + text.split(" ").join("").toLowerCase() + '%') });
        });
    }
}
exports.default = User;
