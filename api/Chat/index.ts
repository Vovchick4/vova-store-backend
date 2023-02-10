import express, { Router } from "express"

import { createMessage } from "./controller"

const router: Router = express.Router()

router.post('/', createMessage)

export default router