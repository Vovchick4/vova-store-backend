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
exports.findFriendsByOwner = exports.deleteAllFriend = exports.createFriend = exports.acceptFriend = void 0;
const friend_model_1 = __importDefault(require("../../db/models/Friend/friend.model"));
const acceptFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const guest = req.user;
        if (userId) {
            yield friend_model_1.default.acceptFriend({ owner_user_id: guest === null || guest === void 0 ? void 0 : guest.id, invated_friend_id: Number(userId) }, (data) => {
                res.status(200).send({ data: data.get() });
            }, (error) => {
                res.status(500).json({ message: error });
            });
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
exports.acceptFriend = acceptFriend;
const createFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const guest = req.user;
        if (userId && (guest === null || guest === void 0 ? void 0 : guest.id) !== Number(userId)) {
            const [friend, created] = yield friend_model_1.default.createFriend({ owner_user_id: guest === null || guest === void 0 ? void 0 : guest.id, invated_friend_id: Number(userId), accepted_friend: null });
            if (created) {
                res.status(200).send({ data: friend.get() });
            }
            else {
                res.status(500).send({ status: 500, message: "AlreadyFriend" });
            }
        }
        else {
            res.status(500).send({ status: 500, message: "Can't add yourself in Friend" });
        }
    }
    catch (e) {
        res.status(500).send({ status: 500, message: e.message });
    }
});
exports.createFriend = createFriend;
const deleteAllFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({ data: yield friend_model_1.default.deleteAllFriend() });
    }
    catch (e) {
        res.status(500).send({ status: 500, message: e.message });
    }
});
exports.deleteAllFriend = deleteAllFriend;
const findFriendsByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guest = req.user;
        if (guest) {
            const finded = yield friend_model_1.default.findMyFriends({ owner_user_id: guest.id });
            res.status(200).send({ data: finded });
        }
    }
    catch (e) {
        res.status(500).send({ status: 500, message: e.message });
    }
});
exports.findFriendsByOwner = findFriendsByOwner;
