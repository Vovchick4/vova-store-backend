"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/search-user', controller_1.searchGuests);
router.get('/get-user/:guestId', controller_1.getGuestById);
router.get('/get-user', passport_1.default.authenticate('jwt', { session: false }), controller_1.getGuest);
router.get('/get-all-user', controller_1.getAllGuest);
router.post('/login', controller_1.logInGuest);
router.post('/register', controller_1.registerGuest);
exports.default = router;
