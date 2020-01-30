var express = require("express");
var path = require("path");
var router = express.Router();
var db = require("./queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.get("/testing", db.testFunc);

module.exports = router;
