import sequelize from "sequelize"
import UserModel from "../db/models/User/user.model"

export interface ICreateUserData {
    nickName: string
    email: string
    password: string

}

export default class User {
    static async createUser(data: ICreateUserData) {
        return await UserModel.create({ ...data })
    }

    static async setSocketIdUser(id: number, socketId: string) {
        const findedUser = await UserModel.findByPk(id)
        if (findedUser) {
            await findedUser.update({ socketId })
        }
    }

    static async getSocketIdUser(id: number) {
        const findedUser = await UserModel.findByPk(id)
        return await findedUser?.get().socketId
    }

    static async findUsersBySearchText(text: string) {
        return await UserModel.findAll({ where: sequelize.where(sequelize.fn('LOWER', sequelize.col('nickName')), 'LIKE', '%' + text.split(" ").join("").toLowerCase() + '%') })
    }
}