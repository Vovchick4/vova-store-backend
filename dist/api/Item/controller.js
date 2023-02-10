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
exports.createItem = exports.getItems = void 0;
const item_model_1 = __importDefault(require("../../db/models/Item/item.model"));
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield item_model_1.default.findAll({});
    if (items.length === 0) {
        res.status(404).json({ message: "Items not found!" });
    }
    else {
        res.send({ data: items });
    }
});
exports.getItems = getItems;
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdItem = yield item_model_1.default.create(Object.assign({}, req.body));
    res.send({ data: createdItem.toJSON() });
});
exports.createItem = createItem;
