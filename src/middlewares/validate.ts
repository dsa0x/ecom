import { Request, Response, NextFunction } from "express";
import { userSchema, userSignInSchema } from "services/joi";
import { ObjectSchema } from "@hapi/joi";

export const validateSignUp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = userSchema.validate(req.body);
  if (validation.error) {
    res.status(400).send({ message: "Invalid request" });
    next(validation.error);
  }
  return next();
};
export const validateSignIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = userSignInSchema.validate(req.body);
  if (validation.error) {
    res.status(400).send({ message: "Invalid email or password" });
    next(validation.error);
  }
  return next();
};
