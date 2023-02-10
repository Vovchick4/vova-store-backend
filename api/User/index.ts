import express, { Router } from "express"
import passport from "passport"

import { getGuest, getAllGuest, getGuestById, searchGuests, logInGuest, registerGuest } from "./controller"

const router: Router = express.Router()

router.get('/search-user', searchGuests)
router.get('/get-user/:guestId', getGuestById)
router.get('/get-user', passport.authenticate('jwt', { session: false }), getGuest)
router.get('/get-all-user', getAllGuest)
router.post('/login', logInGuest)
router.post('/register', registerGuest)

export default router