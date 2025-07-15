const mongoose = require("mongoose");
async function connectToMongoDb(url) {
    mongoose.connect(url);
}

module.exports = {connectToMongoDb,};

//to connect using cli
/*
open mongosh then -> show dbs -> use dbs_name -> show collections -> db.users.find({})
*/
