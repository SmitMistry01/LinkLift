const mongoose = require("mongoose");

async function connectToMongoDb(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

module.exports = { connectToMongoDb };


//to connect using cli
/*
open mongosh then -> show dbs -> use dbs_name -> show collections -> db.users.find({})
*/
