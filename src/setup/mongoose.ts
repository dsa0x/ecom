import mongoose from "mongoose";
import config from "config/index";

mongoose.connect(config.mongoDbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

export const db = mongoose.connection;
// .then((data) => console.log("Mongoose successfully connected"))
// .catch((err) => console.log("An error occured", err));
db.on("error", console.error.bind(console, "Connection Error:"));

export const dbStart = (cb: any) => {
  db.once("open", () => {
    // const changeStream = db.collection('carts').watch()
    // changeStream.on
    console.log("Mongoose successfully connected");
    cb;
  });
};
