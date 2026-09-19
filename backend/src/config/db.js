import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/studypoint_elearning';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB] Connection Failed: ${error.message}`);
    console.warn(`[MongoDB] Running in fallback mode. Ensure MongoDB is running on ${process.env.MONGO_URI || 'mongodb://localhost:27017'}`);
    return false;
  }
};

export default connectDB;
