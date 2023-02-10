import express, { Router } from "express"

import { getItems, createItem } from "./controller"

const router: Router = express.Router()

router.get('/', getItems)
router.post('/', createItem)

export default router