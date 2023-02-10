import { Model, DataTypes } from "sequelize"
import { sequelize } from "../../index"
import Chat from "../Chat/chat.model"
import User from "../User/user.model"

export interface ICreateRoomData {
    owner_user_id: number,
    second_user_id: number
}

class Room extends Model {
    id!: number
    owner_user_id!: number
    second_user_id!: number

    static async createRoom(data: ICreateRoomData) {
        return await Room.create({ ...data })
    }
}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    owner_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    second_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    // RoomId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    // chatId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Chat,
    //         key: "chatId"
    //     }
    // }
    // chat_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // }
}, { sequelize, tableName: "Room" })

Room.sync({}).then(() => {
    Room.belongsTo(User, { as: "owner_user", foreignKey: "owner_user_id" })
    Room.belongsTo(User, { as: "second_user", foreignKey: "second_user_id" })
    Room.hasMany(Chat, { as: "chat", foreignKey: "room_id" })
}).catch(err => console.log(err))

export default Room