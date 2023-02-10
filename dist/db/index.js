"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const db_name = process.env.DB_NAME || "database";
const db_username = process.env.DB_ADMIN_USERNAME || "database";
const db_user_pass = process.env.DB_ADMIN_PASSWORD || "database";
const host = process.env.HOST || "localhost";
exports.sequelize = new sequelize_1.Sequelize(db_name, db_username, db_user_pass, {
    host,
    port: 3338,
    ssl: false,
    dialect: 'mariadb',
});
function dbConnection() {
    exports.sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
}
exports.default = dbConnection;
