import { IOrderlean } from "./../interfaces/Order";
import { Types } from "mongoose";
import CartModel from "models/cart";
import { IProduct } from "interfaces/Product";
import ProductManager from "modelManagers/productManager";
import { ICart, ICartLean } from "interfaces/Cart";

export default class CartManager {
  public static async findCartById(id: Types.ObjectId) {
    const cart = await CartModel.findById(id);

    return cart;
  }
  public static async addToCart(
    product: IProduct,
    userId: Types.ObjectId,
    productQuantity: number
  ) {
    const totalPrice = product.price * productQuantity;
    const productId: Types.ObjectId = product._id;
    const productUpdate = {
      item: product._id,
      quantity: productQuantity,
      totalPrice,
      title: product.title,
      price: product.price,
    };
    try {
      const cartItem = await CartModel.findById(userId);
      if (
        cartItem &&
        cartItem.products.find(
          (each) => JSON.stringify(each.item) == JSON.stringify(productId)
        )
      ) {
        const cart = await CartModel.findOneAndUpdate(
          {
            _id: userId,
            "products.item": productId,
            status: "active",
            "products.price": product.price,
            "products.title": product.title,
          },
          {
            $inc: {
              "products.$.quantity": productQuantity,
              "products.$.totalPrice": totalPrice,
              total: totalPrice,
            },
          },
          { new: true }
        );

        return cart;
      }
      const cart = await CartModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            products: productUpdate,
          },
          $set: { status: "active" },
          $inc: { total: totalPrice },
        },
        { upsert: true, new: true }
      );
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public static async rollbackCart(
    cartItem: ICart,
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    quantity: number
  ) {
    try {
      //   const cartItem = await CartModel.findById(userId);
      const existingProduct = cartItem.products.filter((product) => {
        return product.item == productId;
      });

      if (existingProduct) {
        if (existingProduct[0].quantity == 1) {
          const cart = await CartModel.findOneAndUpdate(
            { _id: userId },
            {
              $set: { updatedAt: new Date() },
              $pull: { products: { item: productId } },
            },
            { new: true }
          );
          return cart;
        }
        const totalPrice = existingProduct[0].price * quantity;
        const cart = await CartModel.findOneAndUpdate(
          {
            _id: userId,
            "products.item": existingProduct[0].item,
          },
          {
            $inc: {
              "products.$.quantity": -quantity,
              "products.$.totalPrice": -totalPrice,
              total: -totalPrice,
            },
          },
          { new: true }
        );
        return cart;
      }

      const cart = await CartModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: { updatedAt: new Date() },
          $pull: { products: { item: productId } },
        },
        { new: true }
      );
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public static async updateCart(
    cartItem: ICart | IOrderlean,

    userId: Types.ObjectId,
    productId?: Types.ObjectId,
    quantity?: number
  ) {
    if (quantity) {
      const existingProduct = cartItem.products.filter((product) => {
        return product.item == productId;
      });

      const oldQuantity = existingProduct[0].quantity;
      const diff = quantity - oldQuantity;
      const newPrice = quantity * existingProduct[0].price;
      console.log(quantity, existingProduct[0].price);

      const cart = await CartModel.findOneAndUpdate(
        {
          _id: userId,
          "products.item": productId,
        },
        {
          $inc: {
            "products.$.quantity": +quantity,
            "products.$.totalPrice": +newPrice,
          },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      return { cart, diff };
    }

    const cart = await CartModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          updatedAt: new Date(),
          status: "complete",
          products: [],
        },
      },
      { new: true }
    );

    return { cart };
  }

  public static async checkExpiredCart(id: Types.ObjectId) {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - 30);
    const carts = await CartModel.find({
      updatedAt: { $lte: threshold },
      status: "active",
    }).cursor();

    while (carts.next()) {
      let cart: ICart = await carts.next();

      for (let i = 0; i < cart.products.length; i++) {
        let product = cart.products[i];
        ProductManager.deleteReserve(cart.id, product);
      }

      CartModel.findOneAndUpdate(
        { _id: cart.id },
        { $set: { status: "expired" } }
      );
    }
  }
}
