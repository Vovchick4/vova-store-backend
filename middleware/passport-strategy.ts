import { PassportStatic } from "passport";
import jwt from "passport-jwt"

import User from "../db/models/User/user.model"

// Configuration for jwt-strategy in 'passport'
const options = {
    jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_JWT_KEY_AUTH || 'secret'
};

export default function initStrategy(passport: PassportStatic) {
    passport.use(new jwt.Strategy(options, async (payload: any, done) => {
        try {
            const guest = await User.findByPk(payload.id)
            if (!guest) {
                return done(null, false)
            } else {
                return done(null, guest.get())
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }))
}

