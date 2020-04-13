import { createWebhook } from "controllers/Webhook";
import Stripe from "stripe";
import express from "express";

const router = express.Router();

router.post(
  "/",
  // Stripe requires the raw body to construct the event
  express.raw({ type: "application/json" }),
  createWebhook
);

export default router;
