var express = require("express");
var path = require("path");
var router = express.Router();
var db = require("./Queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.get("/testing", db.testFunc);
router.post("/auth", db.authenticate);
router.get("/clinics", db.getClinics);

module.exports = router;
