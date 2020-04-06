import UserManager from "database/modelManagers/userManager";
import passport from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
const LocalStrategy = require("passport-local").Strategy;
import {
  VerifyFunction,
  IStrategyOptions,
  IVerifyOptions,
} from "passport-local";
// const LocalStrategy = passportLocal.Strategy;
// let opts: StrategyOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };
// opts.secretOrKey = "secret";
let opts: IStrategyOptions = {
  usernameField: "email",
  passwordField: "password",
};
passport.use(
  new LocalStrategy(
    opts,
    async (
      email: string,
      password: string,
      done: any
    ): Promise<VerifyFunction> => {
      try {
        const user = await UserManager.findByEmail(email);
        if (!user || !user.validatePassword(password)) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }
        done(null, user, { message: "Login successful" });
      } catch (error) {
        done(error);
      }
    }
  )
);
