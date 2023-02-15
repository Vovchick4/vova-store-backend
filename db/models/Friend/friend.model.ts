import {
    Model, DataTypes, Association, Attributes, CreateOptions, ModelStatic, Op
} from "sequelize"
import { MakeNullishOptional } from "sequelize/types/utils"
import { sequelize } from "../../index"
import User from "../User/user.model"

export interface ICreateFriendData {
    owner_user_id: number
    invated_friend_id: number
    accepted_friend: string | null
}

class Friend extends Model {
    id!: number
    owner_user_id!: number
    invated_friend_id!: number
    accepted_friend!: string | null

    static async acceptFriend({ owner_user_id, invated_friend_id }: Omit<ICreateFriendData, "accepted_friend">, onSuccess: (friend: Friend) => void = () => { }, onError: (error: string) => void = () => { }): Promise<void> {
        const finded = await this.findOne({
            include: [this.associations.owner_user, this.associations.invated_friend_id],
            where: { [Op.and]: [{ owner_user_id }, { invated_friend_id }] }
        })
        if (finded) {
            if (finded.accepted_friend) {
                const updated = await finded.update({ acceptFriend: Date.now().toLocaleString() })
                onSuccess(updated)
            }
            onError("AlreadyAccepted")
        } else {
            onError("NotFound")
        }
    }

    static async createFriend(data: ICreateFriendData): Promise<Friend> {
        return await this.create({ ...data })
    }

    static async findMyFriends({ owner_user_id, invated_friend_id }: Omit<ICreateFriendData, "accepted_friend">): Promise<Friend[]> {
        return await this.findAll({ include: [this.associations.owner_user, this.associations.invated_friend_id], where: { [Op.or]: [{ owner_user_id }, { invated_friend_id }] } })
    }

    declare static associations: {
        owner_user: Association<Friend, User>
        invated_friend_id: Association<Friend, User>
    };
}

Friend.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    owner_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNull: false
        }
    },
    invated_friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNull: false
        }
    },
    accepted_friend: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, { sequelize, tableName: "Friend" })

Friend.sync({}).then(() => {
    Friend.belongsTo(User, { as: "owner_user", foreignKey: "owner_user_id" })
    Friend.belongsTo(User, { as: "invated_friend", foreignKey: "invated_friend_id" })
}).catch(err => console.log(err))

export default Friend