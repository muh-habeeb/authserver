import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);

    console.log("db connected : " + con.connection.host);
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);//failure
  }
};
