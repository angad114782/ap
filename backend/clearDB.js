const mongoose = require("mongoose");
require("dotenv").config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop();
      console.log(`🗑️ Dropped collection: ${collection.collectionName}`);
    }

    console.log("✅ All collections dropped successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error dropping collections:", err);
    process.exit(1);
  }
};

clearDB();
