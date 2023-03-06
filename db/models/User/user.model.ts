import bcrypt from "bcrypt"
import {
    DataTypes, Model,
    NonAttribute, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManyHasAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyCountAssociationsMixin, HasManyHasAssociationMixin
} from "sequelize"
import { sequelize } from "../../index"
import RoomModel from "../Room/room.model"
import Chat from "../Chat/chat.model"
import Friend from "../Friend/friend.model"

class UserModel extends Model {
    id!: number
    socketId!: string
    nickName!: string
    email!: string
    password!: string
    declare owner_rooms?: NonAttribute<RoomModel[]>

    // OwnerRooms
    declare getOwnerRooms: HasManyGetAssociationsMixin<RoomModel> // Note the null assertions!
    declare addOwnerRoom: HasManyAddAssociationMixin<RoomModel, number>
    declare addOwnerRooms: HasManyAddAssociationsMixin<RoomModel, number>
    declare setOwnerRooms: HasManySetAssociationsMixin<RoomModel, number>
    declare removeCOwnerRoom: HasManyRemoveAssociationMixin<RoomModel, number>
    declare removeOwnerRooms: HasManyRemoveAssociationsMixin<RoomModel, number>
    declare hasOwnerRoom: HasManyHasAssociationMixin<RoomModel, number>
    declare hasOwnerRooms: HasManyHasAssociationsMixin<RoomModel, number>
    declare countOwnerRooms: HasManyCountAssociationsMixin
    declare createOwnerRoom: HasManyCreateAssociationMixin<RoomModel, 'owner_user_id'>
}

UserModel.init({
    socketId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nickName: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 20]
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true,
            len: [8, 100]
        },
        set(val: string) {
            const salt = bcrypt.genSaltSync(10)
            this.setDataValue("password", bcrypt.hashSync(val, salt))
        },
    }
}, {
    sequelize, tableName: "User"
})

// User.hasMany(Room)
// User.hasMany(Chat)

UserModel.sync({}).then(async () => { }).catch(err => console.log(err))

export default UserModel