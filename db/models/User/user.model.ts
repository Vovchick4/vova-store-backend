import bcrypt from "bcrypt"
import { DataTypes, Model } from "sequelize"
import { sequelize } from "../../index"
import Room from "../Room/room.model"
import Chat from "../Chat/chat.model"
import Friend from "../Friend/friend.model"

export interface ICreateUserData {
    nickName: string
    email: string
    password: string

}

class User extends Model {
    id!: number
    nickName!: string
    email!: string
    password!: string

    static async createUser(data: ICreateUserData) {
        return await User.create({ ...data })
    }

    static async findUsersBySearchText(text: string) {
        return await User.findAll({ where: sequelize.where(sequelize.fn('LOWER', sequelize.col('nickName')), 'LIKE', '%' + text.split(" ").join("").toLowerCase() + '%') })
    }
}

User.init({
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
    sequelize
})

// User.hasMany(Room)
// User.hasMany(Chat)

User.hasMany(Chat, { as: "chat_message", foreignKey: "send_user_id" })
User.hasMany(Room, { as: "owner_user", foreignKey: "owner_user_id" })
User.hasMany(Room, { as: "second_user", foreignKey: "second_user_id" })
User.hasMany(Friend, { as: "invated_friend", foreignKey: "invated_friend_id" })

User.sync({}).then(async () => { }).catch(err => console.log(err))

export default User