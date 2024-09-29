import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB\n", error);
    process.exit(1);
  }
};

export default connectDB;
