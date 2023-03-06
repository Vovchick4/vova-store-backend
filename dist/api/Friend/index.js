"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/:userId', passport_1.default.authenticate('jwt', { session: false }), controller_1.createFriend);
router.post('/accept-friend/:userId', passport_1.default.authenticate('jwt', { session: false }), controller_1.acceptFriend);
router.delete('/destroy-all/', controller_1.deleteAllFriend);
router.get('/', passport_1.default.authenticate('jwt', { session: false }), controller_1.findFriendsByOwner);
exports.default = router;
