const mongoose = require('mongoose');

const dbURI = process.env.MONGO_DB_URL;

 const ConnectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports= ConnectDB