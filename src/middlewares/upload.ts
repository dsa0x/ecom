import { promisify } from "util";
import { Request, Response, NextFunction } from "express";
import { upload } from "services/multer";

export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const images = promisify(upload.array("images", 5));
    await images(req, res);
    next();
    // const images(req, res);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.file, "res");
    console.log("res-----------------");
    const images = promisify(upload.single("file[0]"));
    await images(req, res);
    console.log(images);

    // const images(req, res);
  } catch (err) {
    console.log(err);
  }
};
