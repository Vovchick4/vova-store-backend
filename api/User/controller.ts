import sequelize, { Op } from "sequelize"
import { Request, Response } from "express"
import passport from "passport"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../../db/models/User/user.model"

// JWT constants
const {
    SECRET_JWT_KEY_AUTH,
    EXPIRE_TIME_JWT_AUTH,
}: any = process.env || {};

export const logInGuest = async (req: Request, res: Response) => {
    const { nickName, password } = req.body
    const guest = await User.findOne({ where: { nickName } })
    if (guest) {

        const resultPass = bcrypt.compareSync(password, guest.password)

        if (resultPass) {
            // Get data from candidate
            const { id, email } = guest;

            // Create jwt based on email and id, expiration time - 1 hour
            const token = jwt.sign({ id, email }, SECRET_JWT_KEY_AUTH, { expiresIn: Number(EXPIRE_TIME_JWT_AUTH) });

            // Response [OK] - jwt and user information
            res
                .status(200)
                // .set('Authorization', `Bearer ${token}`)
                .json({ data: { accessToken: token, data: guest.get() } });

        } else {
            res.status(401).json({ status: 422, message: "Not correct password. \n Try again" })
        }

    } else {
        res.status(401).json({ status: 422, message: "Not found Guest. \n Use another nickname" })
    }
}

export const registerGuest = async (req: Request, res: Response) => {
    const { nickName, email, password } = req.body
    try {
        const guest = await User.findOne({ where: { nickName } })
        if (guest) {
            res.json({ message: "User with this nickname or email already exist" })
        } else {
            const createdGuest = await User.create({ nickName, email, ...req.body })
            const token = jwt.sign({ id: createdGuest.id, email: createdGuest.email }, SECRET_JWT_KEY_AUTH, { expiresIn: Number(EXPIRE_TIME_JWT_AUTH) });
            // Response [OK] - jwt and user information
            res
                .status(200)
                // .set('Authorization', `Bearer ${token}`)
                .json({ data: { accessToken: token, data: createdGuest.get() } });
        }
    } catch (error: any) {
        res.status(422).json({ status: 422, message: error.message })
    }
}

export const getGuest = (req: Request, res: Response) => {
    res.send(req.user ? { data: req.user } : { data: { message: 'Please enter' } })
}

export const getAllGuest = async (req: Request, res: Response) => {
    try {
        res.send({ data: await User.findAll({}) })
    } catch (error: any) {
        res.status(422).json({ status: 'Get all guest Error', message: error.message })
    }
}

export const getGuestById = async (req: Request, res: Response) => {
    try {
        const guestID = req.params.guestId
        const finded = await User.findByPk(guestID)
        res.json({ data: finded?.get() })
    } catch (error: any) {
        res.status(422).json({ status: 'Get guest By ID Error', message: error.message })
    }
}

export const searchGuests = async (req: Request, res: Response) => {
    try {
        const text: any = req.query?.searchText
        const finded = await User.findUsersBySearchText(text)
        res.json({ data: finded, status: 'ok', message: 'finded', text: text.split(" ").join("").toLowerCase() })
    } catch (error: any) {
        res.json({ status: 'error', message: error.message })
    }
}