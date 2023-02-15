"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Item_1 = __importDefault(require("./Item"));
const Room_1 = __importDefault(require("./Room"));
const Chat_1 = __importDefault(require("./Chat"));
const Friend_1 = __importDefault(require("./Friend"));
function api(app) {
    app.use("/auth", User_1.default);
    app.use("/items", Item_1.default);
    app.use("/room/", Room_1.default);
    app.use("/chat/", Chat_1.default);
    app.use("/friend/", Friend_1.default);
}
exports.default = api;
