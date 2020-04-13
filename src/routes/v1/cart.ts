import express from "express";
import { addToCart, updateCart, getCart } from "controllers/Cart";
import { authRoute } from "middlewares/auth";

const router = express.Router();

router.get("/", authRoute, getCart);
router.post("/", authRoute, addToCart);
router.patch("/", authRoute, updateCart);
// router.get("/:id", authRoute, getProduct);

export default router;
