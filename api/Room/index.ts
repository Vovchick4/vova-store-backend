import express, { Router } from "express"
import passport from "passport"

import { findByUserIdRoomChat, createUserIdRoomChat } from "./controller"

const router: Router = express.Router()

router.post('/', createUserIdRoomChat)
router.get('/:userId', passport.authenticate('jwt', { session: false }), findByUserIdRoomChat)

export default router