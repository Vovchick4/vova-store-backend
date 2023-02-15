import passport from "passport"
import express, { Router } from "express"

import { createFriend, acceptFriend, findFriendsByOwner } from "./controller"

const router: Router = express.Router()

router.post('/:userId', createFriend)
router.post('/accept-friend/:userId', passport.authenticate('jwt', { session: false }), acceptFriend)
router.get('/:userId', passport.authenticate('jwt', { session: false }), findFriendsByOwner)

export default router