import { Op } from "sequelize"
import RoomModel from "../db/models/Room/room.model"

export interface ICreateRoomData {
    owner_user_id: number,
    second_user_id: number
}

export default class Room {
    static async createRoom(data: ICreateRoomData): Promise<RoomModel> {
        return await RoomModel.create({ ...data })
    }

    static async findRoomByUserId(owner_user_id: number, second_user_id: number): Promise<RoomModel | null> {
        return await RoomModel.findOne({ include: [RoomModel.associations.chat, RoomModel.associations.owner_user, RoomModel.associations.second_user], where: { [Op.or]: [{ owner_user_id, second_user_id }, { owner_user_id: second_user_id, second_user_id: owner_user_id }] } })
    }
}