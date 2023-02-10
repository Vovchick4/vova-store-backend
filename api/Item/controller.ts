import { Request, Response } from "express"

import Item from "../../db/models/Item/item.model"

export const getItems = async (req: Request, res: Response) => {
    const items = await Item.findAll({})
    if (items.length === 0) {
        res.status(404).json({ message: "Items not found!" })
    } else {
        res.send({ data: items })
    }
}

export const createItem = async (req: Request, res: Response) => {
    const createdItem = await Item.create({ ...req.body })
    res.send({ data: createdItem.toJSON() })
}