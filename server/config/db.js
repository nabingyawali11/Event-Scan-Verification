const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const url = process.env.MONGODB_URL;

const connectDB = async () => {
  if (!url) {
    console.error("❌ Error: MONGODB_URL is not defined in your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(url, {
      // This ensures your data goes into the correct database inside your cluster
      dbName: "event_qr_verification",
    });

    console.log(`✅ MongoDB Connected !!!!!`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
