import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import Order from "../models/orderModel.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// Verify Payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// New Route: Get Daily Orders for Graph
orderRouter.get("/daily-orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving daily orders", error });
  }
});

export default orderRouter;
