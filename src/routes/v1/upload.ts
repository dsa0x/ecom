import express from "express";
import { authRoute } from "middlewares/auth";
import { uploadSingle } from "middlewares/upload";

const router = express.Router();

router.post("/", authRoute, uploadSingle);

export default router;
