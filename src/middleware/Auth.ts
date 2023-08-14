import {
  Strategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import passport from "passport";
import prisma from "../lib/prisma";

const keyJWT = process.env.JWT_SECRET || "secret";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keyJWT,
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

export { passport, keyJWT };
