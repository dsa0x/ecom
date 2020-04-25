import Product from "models/product";
import { IProduct, IProductUpdatable } from "interfaces/Product";
import { Types } from "mongoose";
export default class ProductManager {
  /**
   * create a product
   */
  //Static functions can be called directly on the model
  public static async create(
    product: IProduct,
    userId: Types.ObjectId
  ): Promise<IProduct> {
    const now = new Date();
    product.createdAt = now;
    product.updatedAt = now;

    try {
      const _product = await new Product(product);
      _product.owner = userId;
      await _product.save();
      return _product.toObject();
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
    }
  }

  public static async update(
    _id: Types.ObjectId,
    newUpdate: IProductUpdatable
  ): Promise<IProduct | IProduct[]> {
    try {
      const product: IProduct | IProduct[] = await Product.findOneAndUpdate(
        { _id },
        { ...newUpdate, updatedAt: new Date() },
        { new: true }
      )
        .lean<IProduct>()
        .exec();
      return product;
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
    }
  }

  public static async findById(
    _id: Types.ObjectId | string
  ): Promise<IProduct> {
    const product = await Product.findById(_id).lean<IProduct>().exec();

    return product;
  }

  public static async findByOwner(
    _id: Types.ObjectId | string
  ): Promise<IProduct> {
    const product = await Product.findOne({ owner: _id })
      .lean<IProduct>()
      .exec();

    return product;
  }

  public static async findAll(): Promise<IProduct[]> {
    const products: IProduct[] = await Product.find({})
      .select(["-owner"])
      .lean<IProduct>()
      .exec();
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
      console.log(userId, quantity, productId);
      const product = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gte: quantity } },
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

  public static async updateReserve(
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    delta: number
  ) {
    const product = await Product.findOneAndUpdate(
      {
        _id,
        "reservations.id": userId,
        quantity: { $gte: delta },
      },
      {
        $inc: {
          quantity: -delta,
          "reservations.$.quantity": +delta,
        },
      },
      { new: true }
    );
    return product;
  }

  /**
   * static async
   */
  public static async delRes(cartId: Types.ObjectId) {
    const product = Product.updateMany(
      {
        "reservations.id": cartId,
      },
      {
        $pull: { reservations: { id: cartId } },
      },
      { multi: true }
    );
    return product;
  }

  public static async deleteReserve(cartId: Types.ObjectId, product: any) {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - 30);
    const _product = await Product.findOneAndUpdate(
      {
        _id: product.item,
        "reservations.id": cartId,
        updatedAt: { $lte: threshold },
      },
      {
        $inc: { quantity: +product.quantity },
        $pull: { "reservations.$.id": cartId },
      },
      { new: true }
    );
    return _product;
  }
}
