const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const Farmer = require("../models/Farmer");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ========== CREATE PRODUCT (Farmer only) ==========
router.post("/", auth, requireRole("farmer"), upload.array("images", 5), async (req, res) => {
  try {
    console.log("Product creation request:", req.body);
    console.log("Files:", req.files);
    
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) return res.status(404).json({ error: "Farmer profile not found." });

    // Validate required fields
    const { name, category, description, pricePerUnit, unit, availableQuantity, minimumOrder, marketPrice } = req.body;
    
    if (!name || !category || !pricePerUnit || !unit || !availableQuantity) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: { name, category, pricePerUnit, unit, availableQuantity }
      });
    }

    const product = new Product({
      farmerId: farmer._id,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description || "",
      pricePerUnit: Number(req.body.pricePerUnit),
      unit: req.body.unit,
      availableQuantity: Number(req.body.availableQuantity),
      minimumOrder: Number(req.body.minimumOrder) || 1,
      village: farmer.village,
      district: farmer.district,
      state: farmer.state,
      marketPrice: Number(req.body.marketPrice) || 0,
      images: req.files ? req.files.map((f) => `/uploads/products/${f.filename}`) : [],
    });

    await product.save();
    console.log("Product created successfully:", product._id);

    // Update farmer stats
    farmer.totalProducts += 1;
    await farmer.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== GET ALL PRODUCTS (with filters) ==========
router.get("/", async (req, res) => {
  try {
    const { category, state, district, village, search, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (state) filter.state = { $regex: state, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };
    if (village) filter.village = { $regex: village, $options: "i" };
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { pricePerUnit: 1 };
    if (sort === "price_desc") sortOption = { pricePerUnit: -1 };
    if (sort === "popular") sortOption = { totalSold: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .populate("farmerId", "village district state rating")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET SINGLE PRODUCT ==========
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmerId");
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== UPDATE PRODUCT (Farmer only) ==========
router.put("/:id", auth, requireRole("farmer"), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, farmerId: farmer._id });
    if (!product) return res.status(404).json({ error: "Product not found or not yours." });

    Object.assign(product, req.body, { updatedAt: new Date() });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== DELETE PRODUCT (Farmer only) ==========
router.delete("/:id", auth, requireRole("farmer"), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmerId: farmer._id });
    if (!product) return res.status(404).json({ error: "Product not found or not yours." });

    farmer.totalProducts = Math.max(0, farmer.totalProducts - 1);
    await farmer.save();

    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET FARMER'S PRODUCTS ==========
router.get("/farmer/my-products", auth, requireRole("farmer"), async (req, res) => {
  try {
    console.log("My-products request for user:", req.user._id);
    let farmer = await Farmer.findOne({ userId: req.user._id });
    console.log("Farmer found for products:", farmer ? "Yes" : "No");
    
    if (!farmer) {
      console.log("Creating missing farmer profile for user:", req.user._id);
      // Create a basic farmer profile if it doesn't exist
      farmer = new Farmer({
        userId: req.user._id,
        village: "",
        district: "",
        state: "",
        pinCode: "",
        fullAddress: "",
        upiId: "",
        bankAccountNumber: "",
        ifscCode: "",
        panNumber: "",
        category: "smallholder",
        transactionMode: "upi",
      });
      await farmer.save();
      console.log("Farmer profile created successfully");
    }
    
    const products = await Product.find({ farmerId: farmer._id }).sort({ createdAt: -1 });
    console.log("Products found:", products.length);
    res.json(products);
  } catch (err) {
    console.error("My-products error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
