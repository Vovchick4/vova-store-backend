"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Room = void 0;
var room_entity_1 = require("./room.entity");
Object.defineProperty(exports, "Room", { enumerable: true, get: function () { return __importDefault(room_entity_1).default; } });
var user_entity_1 = require("./user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_entity_1).default; } });
