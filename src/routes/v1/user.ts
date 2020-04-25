import express from "express";
import { UserController } from "controllers/User";
// import { createUser, loginUser } from "controllers/User";
import { auth, authRoute } from "middlewares/auth";
import { validateSignIn, validateSignUp } from "middlewares/validate";

const router = express.Router();
const user = new UserController();

router.get("/public", (req, res) => {
  res.send("This is a public route");
});

router.post("/register", user.create);

router.post("/login", validateSignIn, auth);
router.get("/logged", authRoute, (req, res) => {
  res.send("loggedIn");
});

export default router;
