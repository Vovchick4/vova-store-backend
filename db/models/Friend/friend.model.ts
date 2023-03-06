import {
    Model, DataTypes, Association, Attributes, CreateOptions, ModelStatic, Op
} from "sequelize"
import { MakeNullishOptional } from "sequelize/types/utils"
import { sequelize } from "../../index"
import UserModel from "../User/user.model"

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
            include: [this.associations.owner_user, this.associations.invated_friend],
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

    static async createFriend(data: ICreateFriendData): Promise<[Friend, boolean]> {
        return await this.findOrCreate({ include: [this.associations.owner_user, this.associations.invated_friend], where: { owner_user_id: data.owner_user_id, invated_friend_id: data.invated_friend_id }, defaults: { ...data } })
    }

    static async deleteAllFriend(): Promise<number> {
        return await this.destroy({ truncate: true })
    }

    static async findMyFriends({ owner_user_id }: Omit<ICreateFriendData, "invated_friend_id" |
        "accepted_friend">): Promise<{ not_accepted_friends: Friend[], friends: Friend[] }> {
        const findedFriendWithNotAccepted = await this.findAll({ include: [this.associations.owner_user, this.associations.invated_friend], where: { [Op.or]: [{ owner_user_id }, { invated_friend_id: owner_user_id, accepted_friend: { [Op.is]: null } }] } })
        const findedFriendWithAccepted = await this.findAll({ include: [this.associations.owner_user, this.associations.invated_friend], where: { [Op.or]: [{ owner_user_id }, { invated_friend_id: owner_user_id, accepted_friend: { [Op.not]: null } }] } })
        return { not_accepted_friends: findedFriendWithNotAccepted, friends: findedFriendWithAccepted }
    }

    declare static associations: {
        owner_user: Association<Friend, UserModel>
        invated_friend: Association<Friend, UserModel>
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
        allowNull: false
    },
    invated_friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accepted_friend: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, { sequelize, tableName: "Friend" })

UserModel.hasMany(Friend, { as: "invated_friend", foreignKey: "invated_friend_id" })
Friend.belongsTo(UserModel, { as: "owner_user", foreignKey: "owner_user_id" })
Friend.belongsTo(UserModel, { as: "invated_friend", foreignKey: "invated_friend_id" })

Friend.sync({}).then(() => { }).catch(err => console.log(err))

export default Friend