import { Schema, Document, model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

bcrypt.hash = promisify(bcrypt.hash);

export enum Role {
  Admin = "Admin",
  User = "User",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role?: Role;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  hashPassword(password: string): string;
  validatePassword(password: string): boolean;
}

const UserSchema = new Schema({
  name: {
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
    maxlength: 100,
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
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
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
  const payload: { id: string; email: string; exp: Date } = {
    id: this._id,
    email: this.email,
    exp: expirationDate,
  };
  return jwt.sign(payload, process.env.JWT);
};
// UserSchema.methods.confirmPassword = function (password, confirmPassword) {};

UserSchema.pre("save", function () {});

const UserModel = model<IUser>("User", UserSchema, "users");
export default UserModel;
