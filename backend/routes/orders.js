const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// ========== CREATE ORDER ==========
router.post("/", auth, requireRole("b2b", "customer"), async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found.` });
      if (!product.isAvailable) return res.status(400).json({ error: `${product.name} is not available.` });
      if (product.availableQuantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.availableQuantity}` });
      }

      const itemTotal = product.pricePerUnit * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        pricePerUnit: product.pricePerUnit,
        total: itemTotal,
      });

      // Reduce available quantity
      product.availableQuantity -= item.quantity;
      if (product.availableQuantity === 0) product.isAvailable = false;
      await product.save();
    }

    const order = new Order({
      buyerId: req.user._id,
      buyerRole: req.user.role,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "upi",
      notes: notes || "",
    });

    await order.save();

    // Notify farmers
    const farmerProductIds = [...new Set(orderItems.map((i) => i.productId))];
    for (const pid of farmerProductIds) {
      const product = await Product.findById(pid).populate("farmerId");
      if (product && product.farmerId) {
        await new Notification({
          userId: product.farmerId.userId,
          type: "product_sold",
          title: "New Order Received!",
          message: `${product.name} ordered by a ${req.user.role === "b2b" ? "business" : "customer"}.`,
          data: { orderId: order._id },
        }).save();
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET MY ORDERS ==========
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET ORDER BY ID ==========
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyerId", "name email phone")
      .populate("items.productId");
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== UPDATE ORDER STATUS ==========
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Notify buyer
    await new Notification({
      userId: order.buyerId,
      type: "order_update",
      title: "Order Status Updated",
      message: `Order #${order._id.toString().slice(-6)} is now ${status}.`,
      data: { orderId: order._id },
    }).save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CANCEL ORDER ==========
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({ error: "Cannot cancel order after shipping." });
    }

    // Restore product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableQuantity: item.quantity },
        isAvailable: true,
      });
    }

    order.status = "cancelled";
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: "Order cancelled.", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
