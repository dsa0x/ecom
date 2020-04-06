import express from "express";
import { createUser, loginUser } from "controllers/User";
import { auth, authRoute } from "middlewares/auth";

const router = express.Router();

router.get("/public", (req, res) => {
  res.send("This is a public route");
});

router.post("/", createUser);

router.post("/login", auth, loginUser);
router.get("/logged", authRoute, (req, res) => {
  res.send("loggedIn");
});

export default router;
