const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  payerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  amount: { type: Number, required: true },
  method: { type: String, enum: ["upi", "bank_transfer", "card", "cod"], required: true },
  
  // UPI details
  upiTransactionId: { type: String, default: "" },
  
  // Bank transfer details
  bankReference: { type: String, default: "" },
  
  status: { type: String, enum: ["pending", "processing", "completed", "failed", "refunded"], default: "pending" },
  
  settledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
