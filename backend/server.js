import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import adminRoutes from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter); // Order routes including /daily-orders are handled here
app.use("/api/admin", adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
