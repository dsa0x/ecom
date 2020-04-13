import InventoryModel from "models/inventory";
import { IProduct } from "interfaces/Product";
import { Types } from "mongoose";

export default class CartManager {
  public static async addToCart(
    product: IProduct,
    userId: Types.ObjectId,
    productQuantity: number
  ) {
    const price = product.price * productQuantity;
    const productUpdate = {
      item: product._id,
      quantity: productQuantity,
      price,
    };
    try {
      const cart = await InventoryModel.findOneAndUpdate(
        { _id: userId },
        { $set: { owner: userId }, $push: { products: productUpdate } },
        { upsert: true, new: true }
      );
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }
}
