import {
    Model, DataTypes, Association, InferAttributes, InferCreationAttributes, NonAttribute,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManyHasAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyCountAssociationsMixin, HasManyHasAssociationMixin
} from "sequelize"
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
    declare chat?: NonAttribute<Chat[]>

    static async createRoom(data: ICreateRoomData): Promise<Room> {
        return await this.create({ ...data })
    }

    static async findRoomByUserId(owner_user_id: number, second_user_id: number): Promise<Room | null> {
        return await this.findOne({ include: [this.associations.chat, this.associations.owner_user, this.associations.second_user], where: { owner_user_id, second_user_id } })
    }

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    declare getChats: HasManyGetAssociationsMixin<Chat>; // Note the null assertions!
    declare addChat: HasManyAddAssociationMixin<Chat, number>;
    declare addChats: HasManyAddAssociationsMixin<Chat, number>;
    declare setChats: HasManySetAssociationsMixin<Chat, number>;
    declare removeChat: HasManyRemoveAssociationMixin<Chat, number>;
    declare removeChats: HasManyRemoveAssociationsMixin<Chat, number>;
    declare hasChat: HasManyHasAssociationMixin<Chat, number>;
    declare hasChats: HasManyHasAssociationsMixin<Chat, number>;
    declare countChats: HasManyCountAssociationsMixin;
    declare createChat: HasManyCreateAssociationMixin<Chat, 'room_id'>;

    declare static associations: {
        chat: Association<Room, Chat>
        owner_user: Association<Room, User>
        second_user: Association<Room, User>
    };
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

Room.hasMany(Chat, { as: "chat", foreignKey: "room_id" })

Room.sync({}).then(() => {
    Room.belongsTo(User, { as: "owner_user", foreignKey: "owner_user_id" })
    Room.belongsTo(User, { as: "second_user", foreignKey: "second_user_id" })
}).catch(err => console.log(err))

export default Room