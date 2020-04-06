import passport from "passport";
import { Request, Response, NextFunction } from "express";
const auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Error occured",
        error: err,
      });
    }
    req.login(user, (err) => {
      res.send(err);
    });

    const token = user.generateJWT();
    return res.send({ user, token });
  });
};

export default auth;
