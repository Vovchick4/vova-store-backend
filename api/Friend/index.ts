import passport from "passport"
import express, { Router } from "express"

import { acceptFriend, createFriend, deleteAllFriend, findFriendsByOwner } from "./controller"

const router: Router = express.Router()

router.post('/:userId', passport.authenticate('jwt', { session: false }), createFriend)
router.post('/accept-friend/:userId', passport.authenticate('jwt', { session: false }), acceptFriend)
router.delete('/destroy-all/', deleteAllFriend)
router.get('/', passport.authenticate('jwt', { session: false }), findFriendsByOwner)

export default router