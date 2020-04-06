import { Types } from "mongoose";
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
): Promise<void> => {
  try {
    const user = await UserManager.create(req.body);

    res.send(user);
  } catch (error) {
    next(error);
    console.log(error);
  }
};
export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UserManager.findByEmail(req.body.email);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id }: { _id: Types.ObjectId } = req.body;
    const user = await UserManager.update(_id);
    res.send(user);
  } catch (error) {
    next(error);
  }
};
