import { Request, Response } from "express"

import Chat from "../../db/models/Chat/chat.model"

export const findChat = async (req: Request, res: Response) => {

}

export const createMessage = async (req: Request, res: Response) => {
    try {
        const createdMessage = await Chat.create({ ...req.body })
        res.json({ data: createdMessage.get() })
    } catch (error) {
        res.json({ status: 404, message: (error as Error).message })
    }
}