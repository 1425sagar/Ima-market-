import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import {sendRegisterMail} from "../helpers/sendRegisterMail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    // Send a welcome email
    const emailText = `Hi ${name}, welcome to IMA Market! We're excited to have you onboard.`;
    const emailHtml = `<h1>Welcome, ${name}!</h1><p>Thank you for joining <strong>IMA Market</strong>. We're thrilled to have you here.</p>`;

    try {
      await sendRegisterMail(email, emailText, emailHtml); // Send the email
      console.log("Welcome email sent successfully.");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email }, // Payload
      process.env.JWT_SECRET // Secret key
      //{ expiresIn: "1h" } // Token expiry
    );

    res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      adminId: admin._id, // Include the admin's ID in the response
    });
  } catch (error) {
    console.error("Error during admin authentication:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export { adminLogin, loginUser, registerUser };
