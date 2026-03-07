const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Farmer = require("../models/Farmer");
const Business = require("../models/Business");
const Customer = require("../models/Customer");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ========== REGISTER ==========
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, ...profileData } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ error: "Email or phone already registered." });

    // Create user
    const user = new User({ name, email, phone, password, role, status: role === "admin" ? "active" : "pending" });
    await user.save();

    // Create role-specific profile
    if (role === "farmer") {
      const farmer = new Farmer({
        userId: user._id,
        village: profileData.village || "",
        district: profileData.district || "",
        state: profileData.state || "",
        pinCode: profileData.pinCode || "",
        fullAddress: profileData.fullAddress || "",
        upiId: profileData.upiId || "",
        bankAccountNumber: profileData.bankAccountNumber || "",
        ifscCode: profileData.ifscCode || "",
        panNumber: profileData.panNumber || "",
        category: profileData.bankAccountNumber ? "bulk" : "smallholder",
        transactionMode: profileData.bankAccountNumber ? "bank" : "upi",
      });
      await farmer.save();
    } else if (role === "b2b") {
      const business = new Business({
        userId: user._id,
        businessName: profileData.businessName || "",
        gstin: profileData.gstin || "",
        contactPerson: profileData.contactPerson || name,
        officialEmail: profileData.officialEmail || email,
        officeAddress: profileData.officeAddress || "",
        warehouseAddress: profileData.warehouseAddress || "",
        bankAccountNumber: profileData.bankAccountNumber || "",
        ifscCode: profileData.ifscCode || "",
        upiId: profileData.upiId || "",
        panNumber: profileData.panNumber || "",
      });
      await business.save();
    } else if (role === "customer") {
      const customer = new Customer({
        userId: user._id,
        deliveryAddress: profileData.deliveryAddress || "",
        paymentPreference: profileData.paymentPreference || "upi",
      });
      await customer.save();
    }

    const token = generateToken(user);
    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== LOGIN ==========
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });
    if (role && user.role !== role) return res.status(401).json({ error: `This account is not a ${role} account.` });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

    if (user.status === "suspended") return res.status(403).json({ error: "Account suspended. Contact admin." });

    // Update last active
    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET CURRENT USER ==========
router.get("/me", auth, async (req, res) => {
  try {
    console.log("Auth /me endpoint - User:", req.user);
    let profile = null;
    if (req.user.role === "farmer") {
      profile = await Farmer.findOne({ userId: req.user._id });
      console.log("Farmer profile found:", profile ? "Yes" : "No");
    }
    else if (req.user.role === "b2b") {
      profile = await Business.findOne({ userId: req.user._id });
      console.log("Business profile found:", profile ? "Yes" : "No");
    }
    else if (req.user.role === "customer") {
      profile = await Customer.findOne({ userId: req.user._id });
      console.log("Customer profile found:", profile ? "Yes" : "No");
    }

    res.json({ user: req.user, profile });
  } catch (err) {
    console.error("Auth /me error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== CHANGE PASSWORD ==========
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
