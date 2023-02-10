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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = __importDefault(require("../../db/models/User/user.model"));
function initStrategy() {
    passport_1.default.use(new passport_local_1.Strategy((nickName, password, done) => __awaiter(this, void 0, void 0, function* () {
        // User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) { return done(null, false); }
        //     if (!user.verifyPassword(password)) { return done(null, false); }
        //     return done(null, user);
        //   });
        const guest = yield user_model_1.default.findOne({ where: { nickName } });
        if (!guest) {
            return done(null, false);
        }
        else {
            if (guest.comparePassword(password)) {
                return done(null, false);
            }
            else {
                return done(null, guest);
            }
        }
    })));
}
exports.default = initStrategy;
