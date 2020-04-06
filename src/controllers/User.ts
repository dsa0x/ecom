import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import UserManager from "database/modelManagers/userManager";

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserManager.create(req.body);
    res.send(user);
  } catch (e) {
    next(e);
    console.log(e);
  }
};
