import { Router } from "express";
import user from "./user";
import product from "./product";
import cart from "./cart";
import order from "./order";
import webhook from "./webhook";

const router = Router();

router.use("/", user);
router.use("/products", product);
router.use("/cart", cart);
router.use("/order", order);
router.use("/webhook", webhook);

export default router;
