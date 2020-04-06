import mongoose from "mongoose";
import config from "config/index";

mongoose
  .connect(config.mongoDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((data) => console.log("Mongoose successfully connected"))
  .catch((err) => console.log("An error occured", err));
