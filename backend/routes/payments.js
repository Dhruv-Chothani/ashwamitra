const express = require("express");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ========== CREATE PAYMENT ==========
router.post("/", auth, async (req, res) => {
  try {
    const { orderId, method, upiTransactionId, bankReference } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Find the farmer (receiver) from order items
    const Product = require("../models/Product");
    const firstProduct = await Product.findById(order.items[0].productId).populate("farmerId");
    const receiverId = firstProduct?.farmerId?.userId;

    const payment = new Payment({
      orderId: order._id,
      payerId: req.user._id,
      receiverId: receiverId || req.user._id,
      amount: order.totalAmount,
      method: method || order.paymentMethod,
      upiTransactionId: upiTransactionId || "",
      bankReference: bankReference || "",
      status: "processing",
    });

    await payment.save();

    // Update order payment status
    order.paymentStatus = "paid";
    await order.save();

    // Notify farmer
    if (receiverId) {
      await new Notification({
        userId: receiverId,
        type: "payment_received",
        title: "Payment Received!",
        message: `₹${order.totalAmount.toLocaleString()} payment received for order #${order._id.toString().slice(-6)}.`,
        data: { paymentId: payment._id, orderId: order._id },
      }).save();
    }

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET MY PAYMENTS ==========
router.get("/my-payments", auth, async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ payerId: req.user._id }, { receiverId: req.user._id }],
    })
      .populate("orderId")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET PAYMENT BY ID ==========
router.get("/:id", auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("orderId")
      .populate("payerId", "name email")
      .populate("receiverId", "name email");
    if (!payment) return res.status(404).json({ error: "Payment not found." });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SETTLE PAYMENT (Admin) ==========
router.put("/:id/settle", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "completed", settledAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: "Payment not found." });

    res.json({ message: "Payment settled.", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
