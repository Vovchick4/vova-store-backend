import passport from "passport"
import express, { Router } from "express"

import { findByUserIdRoomChat, getLastMessageRoomChat, createUserIdRoomChat } from "./controller"

const router: Router = express.Router()

router.post('/', createUserIdRoomChat)
router.get('/:userId', passport.authenticate('jwt', { session: false }), findByUserIdRoomChat)
router.get('/get-last-msg/:firstId/:secondId', passport.authenticate('jwt', { session: false }), getLastMessageRoomChat)

export default router