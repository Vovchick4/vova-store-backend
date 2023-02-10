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
exports.searchGuests = exports.getGuestById = exports.getAllGuest = exports.getGuest = exports.registerGuest = exports.logInGuest = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../db/models/User/user.model"));
// JWT constants
const { SECRET_JWT_KEY_AUTH, EXPIRE_TIME_JWT_AUTH, } = process.env || {};
const logInGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickName, password } = req.body;
    const guest = yield user_model_1.default.findOne({ where: { nickName } });
    if (guest) {
        const resultPass = bcrypt_1.default.compareSync(password, guest.password);
        if (resultPass) {
            // Get data from candidate
            const { id, email } = guest;
            // Create jwt based on email and id, expiration time - 1 hour
            const token = jsonwebtoken_1.default.sign({ id, email }, SECRET_JWT_KEY_AUTH, { expiresIn: Number(EXPIRE_TIME_JWT_AUTH) });
            // Response [OK] - jwt and user information
            res
                .status(200)
                // .set('Authorization', `Bearer ${token}`)
                .json({ data: { accessToken: token, data: guest.get() } });
        }
        else {
            res.status(401).json({ status: 422, message: "Not correct password. \n Try again" });
        }
    }
    else {
        res.status(401).json({ status: 422, message: "Not found Guest. \n Use another nickname" });
    }
});
exports.logInGuest = logInGuest;
const registerGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickName, email, password } = req.body;
    try {
        const guest = yield user_model_1.default.findOne({ where: { nickName } });
        if (guest) {
            res.json({ message: "User with this nickname or email already exist" });
        }
        else {
            const createdGuest = yield user_model_1.default.create(Object.assign({ nickName, email }, req.body));
            const token = jsonwebtoken_1.default.sign({ id: createdGuest.id, email: createdGuest.email }, SECRET_JWT_KEY_AUTH, { expiresIn: Number(EXPIRE_TIME_JWT_AUTH) });
            // Response [OK] - jwt and user information
            res
                .status(200)
                // .set('Authorization', `Bearer ${token}`)
                .json({ data: { accessToken: token, data: createdGuest.get() } });
        }
    }
    catch (error) {
        res.status(422).json({ status: 422, message: error.message });
    }
});
exports.registerGuest = registerGuest;
const getGuest = (req, res) => {
    res.send(req.user ? { data: req.user } : { data: { message: 'Please enter' } });
};
exports.getGuest = getGuest;
const getAllGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ data: yield user_model_1.default.findAll({}) });
    }
    catch (error) {
        res.status(422).json({ status: 'Get all guest Error', message: error.message });
    }
});
exports.getAllGuest = getAllGuest;
const getGuestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guestID = req.params.guestId;
        const finded = yield user_model_1.default.findByPk(guestID);
        res.json({ data: finded === null || finded === void 0 ? void 0 : finded.get() });
    }
    catch (error) {
        res.status(422).json({ status: 'Get guest By ID Error', message: error.message });
    }
});
exports.getGuestById = getGuestById;
const searchGuests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const text = (_a = req.query) === null || _a === void 0 ? void 0 : _a.searchText;
        const finded = yield user_model_1.default.findUsersBySearchText(text);
        res.json({ data: finded, status: 'ok', message: 'finded', text: text.split(" ").join("").toLowerCase() });
    }
    catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});
exports.searchGuests = searchGuests;
