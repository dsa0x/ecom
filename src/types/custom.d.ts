import { Types } from "mongoose";
declare global {
  namespace Express {
    //  user: User,
    export interface Request {
      params: { id: Types.ObjectId };
      // user: User;
    }
  }
}
