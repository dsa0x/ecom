import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../public/images`));
  },
  filename: (req, file, callback) => {
    console.log(req);
    console.log(file);
    let fileName = req.body.fileName;
    const match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.indexOf(file.mimetype) === -1) {
      const message: Error = new Error(
        `${file.filename} is invalid. Only accept png/jpeg.`
      );
      return callback(message, null);
    }

    // var filename = `${Date.now()}-${fileName}`;
    callback(null, fileName);
  },
});

const formatImageTitle = (str: string, num: number) => {
  str = str.toLowerCase().split(" ").join("-");
  let ext = str.split(".");
  if (str.length <= num) {
    return str + "." + ext[ext.length - 1];
  }
  return str.slice(0, num) + "." + ext[ext.length - 1];
};

export const upload = multer({ storage });
