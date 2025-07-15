const express = require("express");
const {handleGenerateNewShortUrl} = require("../controllers/url");
const router = express.Router();

//add shortid package

router.post("/",handleGenerateNewShortUrl);
module.exports = router;