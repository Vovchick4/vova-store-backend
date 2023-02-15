import { Request, Response } from "express"
import Friend from "../../db/models/Friend/friend.model"

export const acceptFriend = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const guest: any = req.user
        if (userId) {
            await Friend.acceptFriend({ owner_user_id: guest?.id, invated_friend_id: Number(userId) },
                (data) => {
                    res.send({ data: data.get() })
                },
                (error) => {
                    res.send({ status: 404, message: error })
                })
        }
    } catch (e) {
        res.send({ status: 404, message: (e as Error).message })
    }
}

export const createFriend = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const guest: any = req.user
        if (userId) {
            const created = await Friend.createFriend({ owner_user_id: guest?.id, invated_friend_id: Number(userId), accepted_friend: null })
            res.send({ data: created.get() })
        }
    } catch (e) {
        res.send({ status: 404, message: (e as Error).message })
    }
}

export const findFriendsByOwner = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const guest: any = req.user
        if (userId) {
            const finded = await Friend.findMyFriends({ owner_user_id: guest?.id, invated_friend_id: Number(userId) })
            res.send({ data: finded })
        }
    } catch (e) {
        res.send({ status: 404, message: (e as Error).message })
    }
}