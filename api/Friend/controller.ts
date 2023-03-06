import { Request, Response } from "express"
import Friend from "../../db/models/Friend/friend.model"

export const acceptFriend = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const guest: any = req.user
        if (userId) {
            await Friend.acceptFriend({ owner_user_id: guest?.id, invated_friend_id: Number(userId) },
                (data) => {
                    res.status(200).send({ data: data.get() })
                },
                (error) => {
                    res.status(500).json({ message: error })
                })
        }
    } catch (e) {
        res.status(500).json({ message: (e as Error).message })
    }
}

export const createFriend = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const guest: any = req.user
        if (userId && guest?.id !== Number(userId)) {
            const [friend, created] = await Friend.createFriend({ owner_user_id: guest?.id, invated_friend_id: Number(userId), accepted_friend: null })
            if (created) {
                res.status(200).send({ data: friend.get() })
            } else {
                res.status(500).send({ status: 500, message: "AlreadyFriend" })
            }
        } else {
            res.status(500).send({ status: 500, message: "Can't add yourself in Friend" })
        }
    } catch (e) {
        res.status(500).send({ status: 500, message: (e as Error).message })
    }
}

export const deleteAllFriend = async (req: Request, res: Response) => {
    try {
        res.status(200).send({ data: await Friend.deleteAllFriend() })
    } catch (e) {
        res.status(500).send({ status: 500, message: (e as Error).message })
    }
}

export const findFriendsByOwner = async (req: Request, res: Response) => {
    try {
        const guest: any = req.user
        if (guest) {
            const finded = await Friend.findMyFriends({ owner_user_id: guest.id })
            res.status(200).send({ data: finded })
        }
    } catch (e) {
        res.status(500).send({ status: 500, message: (e as Error).message })
    }
}