import { Schema, Document, model, Types } from "mongoose";
import { IOrder } from "interfaces/Order";

const orderSchema = new Schema({
  owner: Types.ObjectId,
  total: {
    type: Number,
  },
  shipping: {
    name: { type: String },
    address: { type: String },
  },
  payment: {
    method: { type: String },
    txn_id: { type: String },
  },
  products: [
    {
      _id: { type: Types.ObjectId },
      quantity: { type: Number },
      name: { type: String },
      price: { type: Number },
    },
  ],
  createdAt: { type: Date, default: new Date() },
});

const Order = model<IOrder>("Order", orderSchema, "orders");
export default Order;
