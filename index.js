const express = require("express");
const path = require("path");
const app = express();
const serverless = require('serverless-http');
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url.js");
const cookieParser = require("cookie-parser");
const urlRoute = require("./routes/routes.js");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.js");
require("dotenv").config();

const {
  restrictToLoggedInUserOnly,
  checkAuth,
} = require("./middleware/auth.js");

const MONGODB_URI = process.env.MONGODB_URI;

connectToMongoDb(process.env.MONGODB_URI)
  .then(() => console.log("Database ready"))
  .catch((err) => {
    console.error("Connection failed", err);
    process.exit(1);
  });


// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Route handlers
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortID", async (req, res) => {
  try {
    const shortId = req.params.shortID;
    console.log(shortId);
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamps: Date.now() } } }
    );


    if (entry) {
      res.redirect(entry.redirectUrl);
    } else {
      res.status(404).send("Url not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = app;
module.exports.handler = serverless(app);