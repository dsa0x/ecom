import { Schema, Document, model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { Role, IUser } from "interfaces/User";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
bcrypt.hash = promisify(bcrypt.hash);

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    lowercase: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 30,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Role,
    default: Role.User,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

//user virtual on lean object
UserSchema.plugin(mongooseLeanVirtuals);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.hashPassword = async function (
  password: string
): Promise<string> {
  try {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  } catch (e) {
    throw new Error(`error occurred: ${e}`);
  }
};

UserSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  const payload: { id: string; email: string; exp: number } = {
    id: this._id,
    email: this.email,
    exp: expirationDate.getTime() / 1000,
  };
  return jwt.sign(payload, process.env.JWT);
};

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await this.hashPassword(this.password);
  }
  next();
});

const UserModel = model<IUser>("User", UserSchema, "users");
export default UserModel;
