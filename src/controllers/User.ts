import { Types } from "mongoose";
import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import UserManager from "modelManagers/userManager";

interface Crud {
  create?(req: Request, res: Response, next: NextFunction): void;
  login?(req: Request, res: Response, next: NextFunction): void;
  update?(req: Request, res: Response, next: NextFunction): void;
  delete?(req: Request, res: Response, next: NextFunction): void;
}

export class UserController implements Crud {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserManager.create(req.body);

      res.send(user);
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id }: { _id: Types.ObjectId } = req.body;
      const user = await UserManager.update(_id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
}
// export const createUser: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = await UserManager.create(req.body);
//     console.log(user);
//     res.send(user);
//   } catch (error) {
//     next(error);
//     console.log(error);
//   }
// };
// export const loginUser: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = await UserManager.findByEmail(req.body.email);
//     console.log(user);
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateUser: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { _id }: { _id: Types.ObjectId } = req.body;
//     const user = await UserManager.update(_id);
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// };
