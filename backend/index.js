import express from "express";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import authRoutes from "../backend/routes/auth.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
