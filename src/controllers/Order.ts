import { IOrder, IOrderlean } from "interfaces/Order";
import { Types } from "mongoose";
import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import OrderManager from "modelManagers/orderManager";
import CartManager from "modelManagers/cartManager";
import ProductManager from "modelManagers/productManager";
import StripeService from "services/stripe";

export const createOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //convert back to mongoose document
    // const _user = User.hydrate(req.user);
    const {
      id,
      email,
      name,
    }: { id: Types.ObjectId; email: string; name: string } = <any>req.user;
    const cart = await CartManager.findCartById(id);
    const order = await OrderManager.create(cart.products as any, id);
    const customer = await StripeService.createCustomer({ email, name });
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: cart.total,
      currency: "eur",
      customer: customer.id,
      receipt_email: customer.email,
      payment_method_types: ["card"],
    });
    await CartManager.updateCart(cart, id);
    await ProductManager.delRes(cart.id);
    // console.log(paymentIntent);
    // res.redirect("/webhook");
    res.send(order);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const getOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const order = await OrderManager.findById(id);
    res.send(order);
  } catch (error) {
    next(error);
  }
};
export const updateOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const constants = ["owner", "createdat", "updatedat"];
    const updated = req.body;
    Object.keys(updated).forEach((key) => {
      if (constants.includes(key.trim().toLowerCase())) {
        return res.status(400).send({ error: "Invalid update" });
      }
    });

    const id = (req.params.id as unknown) as Types.ObjectId;
    // const product = await OrderManager.create(id, updated);
    // res.send(product);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await OrderManager.findAll();
    res.send(products);
  } catch (error) {
    next(error);
  }
};
