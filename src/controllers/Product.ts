import { Types } from "mongoose";
import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import ProductManager from "modelManagers/productManager";
import User from "models/user";

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { role } = req.user as any;
    if (role != "Admin") {
      res.status(401).send({ message: "Unauthorized access" });
      return;
    }
    const slug = req.body.title.toLowerCase().split(" ").join("-");
    if (req.body.images.length == 0) req.body.images.push("default-image.png");

    const _user = User.hydrate(req.user);

    const product = await ProductManager.create(
      { ...req.body, slug },
      _user.id
    );

    res.send(product);
  } catch (error) {
    next(error);
    console.log(error);
  }
};
export const getProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const product = await ProductManager.findById(id);
    res.send(product);
  } catch (error) {
    next(error);
  }
};
export const updateProduct: RequestHandler = async (
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
    const product = await ProductManager.update(id, updated);
    res.send(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await ProductManager.findAll();
    res.send(products);
  } catch (error) {
    next(error);
  }
};
