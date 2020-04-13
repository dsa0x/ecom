import Order from "models/order";
import { IOrder } from "interfaces/Order";
import { Types } from "mongoose";
export default class OrderManager {
  /**
   * create a product
   */
  //Static functions can be called directly on the model
  public static async create(
    order: IOrder,
    userId: Types.ObjectId
  ): Promise<IOrder> {
    const now = new Date();
    order.createdAt = now;

    try {
      const _order = await Order.create({
        owner: userId,
        products: order,
      });
      return _order;
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
    }
  }

  public static async findById(_id: Types.ObjectId | string): Promise<IOrder> {
    const product = await Order.findById(_id).lean<IOrder>().exec();

    return product;
  }

  public static async findByOwner(
    _id: Types.ObjectId | string
  ): Promise<IOrder> {
    const product = await Order.findOne({ owner: _id }).lean<IOrder>().exec();

    return product;
  }

  public static async findAll(): Promise<IOrder[]> {
    const products: IOrder[] = await Order.find({}).lean<IOrder>().exec();
    return products;
  }

  /**
   * static async reserve
   */
  public static async reserve(
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    quantity: number
  ) {
    try {
      const product = await Order.findOneAndUpdate(
        { productId, quantity: { $gte: quantity } },
        {
          $inc: { quantity: -quantity },
          $push: {
            reservations: {
              quantity,
              id: userId,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );
      return product;
    } catch (err) {
      console.log(err);
    }
  }
}
