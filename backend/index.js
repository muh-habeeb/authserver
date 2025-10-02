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

// CORS configuration for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? ["https://authserver-zct5.onrender.com", process.env.CLIENT_URL].filter(Boolean)
    : ["http://localhost:5000", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

const __dirname = path.resolve();
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Environment variables with fallbacks
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Starting server in ${NODE_ENV} mode on port ${PORT}`);

connectDB();
verifyGmailConnection();

app.use("/api/auth", authRoutes);


if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")))
  
  // Serve React app for any non-API routes
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  });
}




app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  console.log("Environment:", NODE_ENV);
});
