"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/', controller_1.createUserIdRoomChat);
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false }), controller_1.findByUserIdRoomChat);
router.get('/get-last-msg/:firstId/:secondId', passport_1.default.authenticate('jwt', { session: false }), controller_1.getLastMessageRoomChat);
exports.default = router;
