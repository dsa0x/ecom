import { IProduct } from "interfaces/Product";
import { Types } from "mongoose";
import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import ProductManager from "modelManagers/productManager";
import CartManager from "modelManagers/cartManager";

export const getCart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId }: { _id: Types.ObjectId } = <any>req.user;
    let cart = await CartManager.findCartById(userId);
    if (!cart) {
      res.send({ cart: [] });
    }

    console.log(JSON.stringify(cart));
    res.send({ cart });
  } catch (err) {
    res.status(400).send(err);
  }
};
export const addToCart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      productId,
      productQuantity,
    }: {
      productId: Types.ObjectId;
      productQuantity: number;
    } = req.body;
    const { _id: userId }: { _id: Types.ObjectId } = <any>req.user;
    const product: IProduct = await ProductManager.findById(productId);
    let cart = await CartManager.addToCart(product, userId, productQuantity);

    //Try to reserve product
    const reserved = await ProductManager.reserve(
      productId,
      userId,
      productQuantity
    );

    if (!reserved) {
      cart = await CartManager.rollbackCart(
        cart,
        productId,
        userId,
        productQuantity
      );
      // console.log(cart, "removed");
    }
    res.send({ cart });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateCart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      productId,
      productQuantity,
    }: {
      productId: Types.ObjectId;
      productQuantity: number;
    } = req.body;
    const { _id: userId }: { _id: Types.ObjectId } = <any>req.user;
    const cart = await CartManager.findCartById(userId);
    let { cart: updatedCart, diff } = await CartManager.updateCart(
      cart,
      userId,
      productId,
      productQuantity
    );
    //Try to reserve product
    const reserved = await ProductManager.updateReserve(
      productId,
      userId,
      productQuantity
    );
    if (!reserved) {
      updatedCart = await CartManager.rollbackCart(
        updatedCart,
        productId,
        userId,
        productQuantity
      );
    }
    res.send({ updatedCart });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
