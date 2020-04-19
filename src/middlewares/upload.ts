import { promisify } from "util";
import { Request, Response, NextFunction } from "express";
import { upload } from "services/multer";

export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const images = promisify(upload.array("images", 5));
  await images(req, res);
  next();
  // const images(req, res);
};
