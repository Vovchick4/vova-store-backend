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
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const user_model_1 = __importDefault(require("../db/models/User/user.model"));
// Configuration for jwt-strategy in 'passport'
const options = {
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_JWT_KEY_AUTH || 'secret'
};
function initStrategy(passport) {
    passport.use(new passport_jwt_1.default.Strategy(options, (payload, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const guest = yield user_model_1.default.findByPk(payload.id);
            if (!guest) {
                return done(null, false);
            }
            else {
                return done(null, guest.get());
            }
        }
        catch (error) {
            console.log(error.message);
        }
    })));
}
exports.default = initStrategy;
