const shortid = require("shortid");
const URL = require("../models/url.js");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  } else {
    const shortID = shortid.generate(); // Generate a unique short ID
    await URL.create({
      shortId: shortID,
      redirectUrl: body.url,
      visitHistory: [],
      createdBy:req.user._id,
    });

    return res.render("home", {
      id: shortID,
    });
  }
}

module.exports = { handleGenerateNewShortUrl };
