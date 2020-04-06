import User, { IUser, Role } from "database/models/User";
import { Types } from "mongoose";
export default class UserManager {
  /**
   * create
   */
  //Static functions can be called directly on the model
  public static async create(user: IUser): Promise<IUser> {
    const now = new Date();
    user.createdAt = now;
    user.updatedAt = now;
    user.role = Role.User;
    if (user.password !== user.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    try {
      const _user = await new User(user);
      // _user.password = await _user.hashPassword(user.password);
      await _user.save();
      return _user.toObject();
    } catch (e) {
      throw new Error(`error occurred: ${e}`);
    }
  }

  public static async update(_id: Types.ObjectId): Promise<IUser> {
    try {
      const user = await User.updateOne(
        { _id },
        { $set: { updatedAt: new Date() } }
      ); //.lean().exec()
      return user;
    } catch (e) {
      throw new Error(`error occurred: ${e}`);
    }
  }

  public static async findById(_id: Types.ObjectId): Promise<IUser> {
    const user = await User.findById(_id)
      .lean<IUser>({ virtuals: true })
      .exec();
    return user;
  }
  public static async findByEmail(email: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email }).select("-password");
      return user;
    } catch (e) {
      throw new Error(`error occurred: ${e}`);
    }
  }

  public static async updates(): Promise<IUser> {
    try {
      const user = await User.findOne({}).select("-password");
      return user;
    } catch (e) {
      throw new Error(`error occurred: ${e}`);
    }
  }
}
