import mongoose from "mongoose";

// Get URL String
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  const connectionSTate = mongoose.connection.readyState;

  if (connectionSTate === 1) {
    console.log("Already connected");
    return;
  }
  if (connectionSTate === 2) {
    console.log("Connnecting...");
    return;
  }
  try {
    mongoose.connect(MONGODB_URL, {
      dbName: "APIDB",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error) {
    console.log("DB Connection Error", error);
    throw new Error(error);
  }
};

export default connectDB