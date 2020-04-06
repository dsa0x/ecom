import passport from "passport";
import { Request, Response, NextFunction } from "express";
export const auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (err || !user) {
      return res.status(400).json({
        message: "Error occured",
        error: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      const token = user.generateJWT();
      const { password, ..._user } = user.toObject();
      return res.send({ _user, token, info });
    });
  })(req, res, next);
};

export const authRoute = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate("jwt")(req, res, next);
};
