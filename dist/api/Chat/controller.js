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
exports.createMessage = exports.findChat = void 0;
const chat_model_1 = __importDefault(require("../../db/models/Chat/chat.model"));
const findChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.findChat = findChat;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdMessage = yield chat_model_1.default.create(Object.assign({}, req.body));
        res.json({ data: createdMessage.get() });
    }
    catch (error) {
        res.json({ status: 404, message: error.message });
    }
});
exports.createMessage = createMessage;
