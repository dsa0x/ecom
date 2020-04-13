import express from "express";
import {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
} from "controllers/Product";
import { authRoute } from "middlewares/auth";

const router = express.Router();

router.post("/", authRoute, createProduct);
router.get("/:id", authRoute, getProduct);
router.patch("/:id", authRoute, updateProduct);
router.get("/", authRoute, getAllProducts);

export default router;
