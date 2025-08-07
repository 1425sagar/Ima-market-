import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import adminModel from "../models/adminModel.js";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      adminId,
    } = req.body;

    // Validate adminId
    const adminIdObjectId = new mongoose.Types.ObjectId(adminId);
    // Validate adminId
    const adminExists = await adminModel.findOne({ _id: adminIdObjectId });
    if (!adminExists) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
      adminId,
    };

    // Fetch admin by adminId to get the email
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.json({ success: false, message: "User not found" });
    }

    // Add the email to the product data
    productData.email = admin.email;

    console.log(productData);

    // Create a new product using the updated productData
    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProductsAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    //console.log("Admin ID:", adminId);
    const adminIdObjectId = new mongoose.Types.ObjectId(adminId);
    // Validate adminId
    const adminExists = await adminModel.findOne({ _id: adminIdObjectId });
    if (!adminExists) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const products = await productModel.find({ adminId });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    const { id, adminId } = req.body;

    // Find the product by ID
    const product = await productModel.findById(id);

    // Check if the product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("removeProduct Admin ID:", adminId);
    console.log("removeProduct product.adminId:", product.adminId);
    // Verify ownership: Check if the adminId matches the product's adminId
    if (product.adminId.toString() !== adminId) {
      return res.json({
        success: false,
        message:
          "Access denied. You are not authorized to remove this product.",
      });
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info for frontend
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from the URL params
    const product = await productModel
      .findById(productId)
      .populate("adminId", "email"); // Populate only the email from adminModel
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};


// function for single product info for admin
const singleProductAdmin = async (req, res) => {
  try {
    const { productId, adminId } = req.params;
    const product = await productModel.findById(productId);

    // Check if product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // If adminId is provided, ensure the product belongs to this admin
    if (adminId && product.adminId.toString() !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This product does not belong to you.",
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  listProductsAdmin,
  removeProduct,
  singleProduct,
  singleProductAdmin,
};
