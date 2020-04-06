import express from "express";
import { createUser } from "controllers/User";

const router = express.Router();

router.get("/public", (req, res) => {
  res.send("This is a public route");
});

router.post("/", createUser).get("/", (req, res) => {
  res.send("Hello");
});

export default router;
