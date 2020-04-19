import express from "express";
import {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
} from "controllers/Product";
import { authRoute } from "middlewares/auth";
import { uploadFiles } from "middlewares/upload";

const router = express.Router();

router.post("/", authRoute, uploadFiles, createProduct);
router.get("/:id", authRoute, getProduct);
router.patch("/:id", authRoute, updateProduct);
router.get("/", authRoute, getAllProducts);

export default router;
