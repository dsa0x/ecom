import { Role } from "interfaces/User";
import Joi from "@hapi/joi";

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .valid(Joi.ref("password")),
  email: Joi.string().email().max(100).required(),
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  verified: Joi.boolean().default(false),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  role: Joi.string().valid(Role.Admin, Role.User),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
