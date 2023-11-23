import mongoose from "mongoose";


/**
 * @description Connect to MongoDB
 * @param {string} MONGO_URI
 * @returns {void}
 */

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connected on: ${url}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
