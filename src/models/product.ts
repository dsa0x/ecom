import { Schema, Document, model, Types } from "mongoose";
import { IProduct } from "interfaces/Product";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: "Default",
  },
  brand: {
    type: String,
  },
  images: [
    {
      type: String,
      default: "",
    },
  ],
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  reservations: [
    {
      id: { type: Types.ObjectId, ref: "User" },
      quantity: { type: Number },
      createdAt: { type: Date },
    },
  ],
});

const Product = model<IProduct>("Products", ProductSchema, "products");
export default Product;
