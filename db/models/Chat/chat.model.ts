import { Model, DataTypes, ModelStatic } from "sequelize"
import { sequelize } from "../../index"
import RoomModel from "../Room/room.model"
import UserModel from "../User/user.model"

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

UserModel.hasMany(Chat, { as: "chat_message", foreignKey: "send_user_id" })
Chat.belongsTo(UserModel, { as: "user_message", foreignKey: "send_user_id" })
RoomModel.hasMany(Chat, { as: "chat", foreignKey: "room_id" })
Chat.belongsTo(RoomModel, { as: "room", foreignKey: "room_id" })

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
}).catch(err => console.log(err))

export default Chat