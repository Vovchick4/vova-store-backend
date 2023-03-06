import {
    Model, DataTypes, Association, InferAttributes, InferCreationAttributes, NonAttribute,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManyHasAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyCountAssociationsMixin, HasManyHasAssociationMixin, Op, HasOneGetAssociationMixin, HasOneCreateAssociationMixin, HasOneSetAssociationMixin
} from "sequelize"
import { sequelize } from "../../index"
import Chat from "../Chat/chat.model"
import Friend from "../Friend/friend.model"
import UserModel from "../User/user.model"

class RoomModel extends Model {
    id!: number
    owner_user_id!: number
    second_user_id!: number
    declare chat?: NonAttribute<Chat[]>
    declare owner_user?: NonAttribute<UserModel>
    declare second_user?: NonAttribute<UserModel>

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    // Chats
    declare getChats: HasManyGetAssociationsMixin<Chat> // Note the null assertions!
    declare addChat: HasManyAddAssociationMixin<Chat, number>
    declare addChats: HasManyAddAssociationsMixin<Chat, number>
    declare setChats: HasManySetAssociationsMixin<Chat, number>
    declare removeChat: HasManyRemoveAssociationMixin<Chat, number>
    declare removeChats: HasManyRemoveAssociationsMixin<Chat, number>
    declare hasChat: HasManyHasAssociationMixin<Chat, number>
    declare hasChats: HasManyHasAssociationsMixin<Chat, number>
    declare countChats: HasManyCountAssociationsMixin
    declare createChat: HasManyCreateAssociationMixin<Chat, 'room_id'>
    // FirstUser
    declare getOwnerUser: HasOneGetAssociationMixin<UserModel>
    declare setOwnerUser: HasOneSetAssociationMixin<UserModel, "owner_user_id">
    declare createOwnerUser: HasOneCreateAssociationMixin<UserModel>
    // SecondUser
    declare getSecondUser: HasOneGetAssociationMixin<UserModel>
    declare setSecondUser: HasOneSetAssociationMixin<UserModel, "second_user_id">
    declare createSecondUser: HasOneCreateAssociationMixin<UserModel>

    declare static associations: {
        chat: Association<RoomModel, Chat>
        owner_user: Association<RoomModel, UserModel>
        second_user: Association<RoomModel, UserModel>
    };
}

RoomModel.init({
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

UserModel.hasMany(RoomModel, { as: "owner_rooms", foreignKey: "owner_user_id" })
UserModel.hasMany(RoomModel, { as: "second_user", foreignKey: "second_user_id" })

RoomModel.belongsTo(UserModel, { as: "owner_user", foreignKey: "owner_user_id" })
RoomModel.belongsTo(UserModel, { as: "second_user", foreignKey: "second_user_id" })

RoomModel.sync({}).then(() => { }).catch(err => console.log(err))

export default RoomModel