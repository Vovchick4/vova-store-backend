"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../../index");
class Item extends sequelize_1.Model {
}
Item.init({
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    }
}, { sequelize: index_1.sequelize });
Item.sync({}).then(() => {
}).catch(err => console.log(err));
exports.default = Item;
