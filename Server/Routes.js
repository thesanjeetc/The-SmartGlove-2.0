var express = require("express");
var path = require("path");
var router = express.Router();
var db = require("./Queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.post("/auth", db.authenticate);
router.get("/clinics", db.getClinics);

router.get("/client/:userID", db.getClientDetails);
router.get("/client/:clientID/sessions", db.getClientSessions); // ***
router.get("/client/:clientID/sessions/:sessionID", db.getClientSessions); // ***

router.get("/client/:clientID/recordings", db.getClientSessions); // ***
router.get("/client/:clientID/recordings/:recordingID", db.getClientSessions); // ***

router.get("/client/recordings/:recordingID", db.getRecording);
router.post("/client/recordings/:sessionID/new", db.createRecording);
router.put("/client/recordings/:recordingID/name", db.updateRecording);
router.delete("/client/recordings/:recordingID/delete", db.deleteRecording);

router.get("/physio/:userID", db.getPhysioDetails);
router.get("/physio/:physioID/clients", db.getPhysioClients);
router.get("/physio/:physioID/sessions", db.getPhysioSessions);
router.get("/physio/:physioID/sessions/:clientID", db.getPhysioClientSession);
router.get("/physio/:physioID/recordings", db.getPhysioSessions); // ***
router.get("/physio/:physioID/recordings/:recordingID", db.getPhysioSessions); // ***

module.exports = router;
