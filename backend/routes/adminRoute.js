import express from "express";
import Admin from "../models/adminModel.js";

const router = express.Router();

// Create Admin Account
router.post("/create", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
