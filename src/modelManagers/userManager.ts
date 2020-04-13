import { validateSignUp } from "middlewares/validate";
import User from "models/user";
import { IUser, Role } from "interfaces/User";
import { userSchema, userSignInSchema } from "services/joi";
import { Types } from "mongoose";

export default class UserManager {
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
      const validation = userSchema.validate(user);
      if (validation.error) {
        throw new Error(`${validation.error.message}`);
      }
      const _user = await new User(user);
      await _user.save();
      return _user.toObject();
    } catch (error) {
      throw new Error(`Error occurred: ${error}`);
    }
  }

  public static async update(_id: Types.ObjectId): Promise<IUser> {
    try {
      const user = await User.updateOne(
        { _id },
        { $set: { updatedAt: new Date() } }
      ); //.lean().exec()
      return user;
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
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
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
    }
  }

  public static async updates(): Promise<IUser> {
    try {
      const user = await User.findOne({}).select("-password");
      return user;
    } catch (error) {
      throw new Error(`error occurred: ${error}`);
    }
  }
}
