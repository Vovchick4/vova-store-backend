import { Model, DataTypes, ModelStatic } from "sequelize"
import { sequelize } from "../../index"
import Room from "../Room/room.model"
import User from "../User/user.model"

export interface ICreateMessageData {
    nickName: string,
    message: string,
    room_id: number,
    send_user_id: number,
}

class Chat extends Model {
    id!: number
    send_user_id!: number
    room_id!: number
    nickName!: string
    message!: string
    // // define association here
    // static associate(models: { User: ModelStatic<Model<any, any>>; Room: ModelStatic<Model<any, any>> }) {
    //     Chat.belongsTo(models.User, { as: "User" })
    //     Chat.belongsTo(models.Room, { as: "Room", foreignKey: "roomId" })
    // }

    static async createMessage(data: ICreateMessageData) {
        return await this.create({ ...data })
    }
}

Chat.init({
    // chatId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    // roomRoomId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Room,
    //         key: "roomRoomId"
    //     }
    // },
    nickName: {
        type: DataTypes.STRING,
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    send_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
    },
}, { sequelize, tableName: "Chat" })

Chat.sync({}).then(() => {
    // Chat.belongsTo(User, { as: "User" })
    // Chat.belongsTo(Room, { 
    //     foreignKey: {
    //         field: "room_id",
    //         allowNull: false,
    //     },
    //     targetKey: "id",
    //     as: "room"
    // })
    Chat.belongsTo(Room, { as: "room", foreignKey: "room_id" })
    Chat.belongsTo(User, { as: "user_message", foreignKey: "send_user_id" })
}).catch(err => console.log(err))

export default Chat