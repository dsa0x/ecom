import { IUser } from "interfaces/User";
import config from "config/index";
import UserManager from "modelManagers/userManager";
import User from "models/user";
import { Types } from "mongoose";
import passport from "passport";
import { ExtractJwt } from "passport-jwt";
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
import {
  VerifyFunction,
  IStrategyOptions,
  IVerifyOptions,
} from "passport-local";

let opts: IStrategyOptions = {
  usernameField: "email",
  passwordField: "password",
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy(
    opts,
    async (
      email: string,
      password: string,
      done: (error: any, user?: any, options?: IVerifyOptions) => void
    ): Promise<void> => {
      try {
        const user = await User.findOne({ email });

        if (!user || !(await user.validatePassword(password))) {
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

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async function (
      payload: { id: Types.ObjectId },
      done: (error: any, user?: any, options?: IVerifyOptions) => void
    ) {
      try {
        const user = await UserManager.findById(payload.id);

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
