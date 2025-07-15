const express = require("express");
const path = require("path");
const app = express();
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url.js");
const cookieParser = require("cookie-parser");
const urlRoute = require("./routes/routes.js");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.js");
const {
  restrictToLoggedInUserOnly,
  checkAuth,
} = require("./middleware/auth.js");

const PORT = 8081;
const HOST = "localhost";
//console.log()
connectToMongoDb("mongodb://127.0.0.1:27017/short_url")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

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

app.listen(PORT, HOST, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
