import express from "express";
import { connectDB } from "./db/connectDb.js";
import { verifyGmailConnection } from "./mailing/gmail.config.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import path from "path"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST"]
}))

const __dirname = path.resolve();
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
connectDB();
verifyGmailConnection();

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")))
  
  // Serve React app for any non-API routes
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  })
}
  app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
