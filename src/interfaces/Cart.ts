import { Document, Types } from "mongoose";

export interface ICartLean {
  owner: Types.ObjectId;
  status: string;
  products: {
    item: Types.ObjectId;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  total: number;
  updatedAt: Date;
}

export type ICart = ICartLean & Document;
