import { Types } from "mongoose";
declare global {
  namespace Express {
    export interface Request {
      params: { id: Types.ObjectId };
      // user: User;
    }
  }
}
