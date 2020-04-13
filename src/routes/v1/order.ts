import express from "express";
import { createOrder, getOrder, getAllOrders } from "controllers/Order";
import { authRoute } from "middlewares/auth";

const router = express.Router();

router.post("/", authRoute, createOrder);
router.get("/:id", authRoute, getOrder);
router.get("/", authRoute, getAllOrders);

export default router;
