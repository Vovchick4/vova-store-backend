import { Sequelize, DataTypes } from "sequelize"

const db_name: string = process.env.DB_NAME || "database"
const db_username: string = process.env.DB_ADMIN_USERNAME || "database"
const db_user_pass: string = process.env.DB_ADMIN_PASSWORD || "database"
const host: string = process.env.HOST || "localhost"

export const sequelize = new Sequelize(db_name, db_username, db_user_pass, {
    host,
    port: 5432,
    ssl: false,
    dialect: 'postgres',
})

export default function dbConnection(callback = () => { }) {
    sequelize.sync().then(() => {
        console.log('Connection has been established successfully.');
        callback()
    }).catch((error) => {
        console.error('Unable to connect to the database:', error)
    })
}

