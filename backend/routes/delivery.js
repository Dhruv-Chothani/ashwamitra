const express = require("express");
const Order = require("../models/Order");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// ========== UPDATE DELIVERY INFO ==========
router.put("/orders/:id/delivery", auth, async (req, res) => {
  try {
    const { trackingNumber, deliveryPartner, estimatedDelivery, status } = req.body;

    const update = { updatedAt: new Date() };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (deliveryPartner) update.deliveryPartner = deliveryPartner;
    if (estimatedDelivery) update.estimatedDelivery = new Date(estimatedDelivery);
    if (status) update.status = status;
    if (status === "delivered") update.actualDelivery = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found." });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET DELIVERIES IN TRANSIT ==========
router.get("/in-transit", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["shipped", "in_transit"] },
    })
      .populate("buyerId", "name phone")
      .sort({ updatedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TRACK ORDER ==========
router.get("/track/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("buyerId", "name phone")
      .populate("items.productId");
    if (!order) return res.status(404).json({ error: "Order not found." });

    const timeline = [
      { status: "Order Placed", time: order.createdAt, completed: true },
      { status: "Confirmed", time: order.updatedAt, completed: ["confirmed", "processing", "shipped", "in_transit", "delivered"].includes(order.status) },
      { status: "Processing", time: order.updatedAt, completed: ["processing", "shipped", "in_transit", "delivered"].includes(order.status) },
      { status: "Shipped", time: order.updatedAt, completed: ["shipped", "in_transit", "delivered"].includes(order.status) },
      { status: "In Transit", time: order.updatedAt, completed: ["in_transit", "delivered"].includes(order.status) },
      { status: "Delivered", time: order.actualDelivery || null, completed: order.status === "delivered" },
    ];

    res.json({ order, timeline, trackingNumber: order.trackingNumber, deliveryPartner: order.deliveryPartner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
