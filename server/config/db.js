import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000,       // Give up initial connection after 10s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ENOTFOUND')) {
      console.error('Hint: DNS issue. Check your MONGO_URI.');
    } else if (error.message.includes('SSL') || error.message.includes('tlsv1 alert internal error')) {
      console.error('Hint: SSL error. This often means your IP is not whitelisted in MongoDB Atlas.');
    }
    console.error('SERVER WARNING: The database connection failed. If you see this, please ensure your IP address is added to the MongoDB Atlas Network Access whitelist!');
    // Removed process.exit(1) so nodemon doesn't crash the proxy entirely
  }
};

export default connectDB;
