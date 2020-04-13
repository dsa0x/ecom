import { ICart } from "interfaces/Cart";
import { Schema, Document, model, Types } from "mongoose";

enum cartStatus {
  active = "active",
  expired = "expired",
  complete = "complete",
}

const cartSchema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      item: { type: Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
      totalPrice: { type: Number, default: 0 },
    },
  ],
  status: {
    type: cartStatus,
    default: cartStatus.active,
  },
  total: {
    type: Number,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const CartModel = model<ICart>("Cart", cartSchema, "cart");
export default CartModel;
