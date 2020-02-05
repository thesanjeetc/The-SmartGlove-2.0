var express = require("express");
var path = require("path");
var router = express.Router();
var db = require("./Queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.post("/auth", db.authenticate);
router.get("/clinics", db.getClinics);

router.get("/client/:id", db.getClientDetails);

router.get("/physio/:id", db.getPhysioDetails);
router.get("/physio/:id/clients", db.getPhysioClients);

module.exports = router;
