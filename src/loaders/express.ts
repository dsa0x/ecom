import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
// import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "services/swagger";
import cookieParser from "cookie-parser";
import cors from "cors";
import Logger from "morgan";
import routes from "routes/v1";
import passport from "passport";
import "services/passport";
const app = express();

//parse incoming requests
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
//This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//We can use express.json() now

// export default ({ app }: { app: Application }) => {
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const corsOptions = {origin: 'http://localhost:3000',optionsSuccessStatus: 200} //optional
// app.options('*', cors()) // enable preflight requests
app.use(cors());
app.use(Logger("combined")); //To log messages
app.use(cookieParser()); //To parse cookies
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//catch 404 errors
app.use((req: Request, res: Response, next: NextFunction) =>
  next(new Error("Page Not found"))
);
// };

export default app;
