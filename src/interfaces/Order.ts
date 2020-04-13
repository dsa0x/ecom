import { Document, Types } from "mongoose";
export interface IOrderlean {
  total: number;
  owner: Types.ObjectId;
  shipping: { address: string };
  products: {
    item: Types.ObjectId;
    quantity: number;
    name: string;
    price: number;
    totalPrice: number;
  }[];
  createdAt: Date;
}

export type IOrder = IOrderlean & Document;
