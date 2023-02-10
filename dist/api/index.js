"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./User/index"));
const index_2 = __importDefault(require("./Item/index"));
const index_3 = __importDefault(require("./Room/index"));
const index_4 = __importDefault(require("./Chat/index"));
function api(app) {
    app.use("/auth", index_1.default);
    app.use("/items", index_2.default);
    app.use("/room/", index_3.default);
    app.use("/chat/", index_4.default);
}
exports.default = api;
