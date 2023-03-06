import { Request, Response } from "express"
import UserModel from "../../db/models/User/user.model"
import { Room } from "../../entities"
import Chat from "../../db/models/Chat/chat.model"
import RoomModel from "../../db/models/Room/room.model"

export const findByUserIdRoomChat = async (req: Request, res: Response) => {
    const guest: any = req.user
    const { userId } = req.params

    try {
        const finded = await RoomModel.findOne({ include: [RoomModel.associations.owner_user, RoomModel.associations.second_user, RoomModel.associations.chat], where: { owner_user_id: guest?.id, second_user_id: userId } })
        if (finded) {
            res.json({ data: finded.get() })
        } else {
            res.json({ status: 404, message: "Not found Room" })
        }
    } catch (error: any) {
        res.json({ message: error.message })
    }
}

export const getLastMessageRoomChat = async (req: Request, res: Response) => {
    try {
        const { firstId, secondId } = req.params
        if (firstId && secondId) {
            const findedRoom = await Room.findRoomByUserId(Number(firstId), Number(secondId))
            if (findedRoom?.chat) {
                const chat = findedRoom.chat
                const lastMessage = chat[chat.length - 1]
                res.status(200).json({ data: lastMessage })
            } else {
                res.status(404).json({ status: 404, message: "Not found in this room_chat" })
            }
        } else {
            res.status(500).json({ status: 500, message: "Provide pls ops Id's" })
        }
    } catch (error: any) {
        res.status(500).json({ status: 500, message: error.message })
    }
}

export const createUserIdRoomChat = async (req: Request, res: Response) => {
    try {
        const createdRoom = await RoomModel.create({ ...req.body })
        res.json({ data: createdRoom.get() })
    } catch (error: any) {
        res.json({ message: error.message })
    }
}