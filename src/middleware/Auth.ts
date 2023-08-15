import {
  Strategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import passport from "passport";
import prisma from "../lib/prisma";
import config from "../lib/config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};
passport.use(
  new Strategy(opts, async (jwt_payload: any, done: VerifiedCallback) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: jwt_payload.id },
      });
      if (!user) return done(null, false);

      return done(null, jwt_payload);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
