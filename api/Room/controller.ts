import { Request, Response } from "express"
import User from "../../db/models/User/user.model"
import Room from "../../db/models/Room/room.model"
import Chat from "../../db/models/Chat/chat.model"

export const findByUserIdRoomChat = async (req: Request, res: Response) => {
    const guest: any = req.user
    const { userId } = req.params

    try {
        const finded = await Room.findOne({ include: [Room.associations.owner_user, Room.associations.second_user, Room.associations.chat], where: { owner_user_id: guest?.id, second_user_id: userId } })
        if (finded) {
            res.json({ data: finded.get() })
        } else {
            res.json({ status: 404, message: "Not found Room" })
        }
    } catch (error: any) {
        res.json({ message: error.message })
    }
}

export const createUserIdRoomChat = async (req: Request, res: Response) => {
    try {
        const createdRoom = await Room.create({ ...req.body })
        res.json({ data: createdRoom.get() })
    } catch (error: any) {
        res.json({ message: error.message })
    }
}