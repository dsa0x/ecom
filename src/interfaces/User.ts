import { Document } from "mongoose";
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
