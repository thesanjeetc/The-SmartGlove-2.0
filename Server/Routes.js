var express = require("express");
var path = require("path");
var router = express.Router();
var db = require("./Queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.post("/api/auth", db.authenticate);
router.get("/api/clinics", db.getClinics);

router.get("/api/client/:userID", db.getClientDetails);
router.get("/api/client/:clientID/sessions", db.getClientSessions);
router.get("/api/client/:clientID/sessions/:sessionID", db.getClientSessionRecordings);

router.get("/api/client/:clientID/recordings", db.getClientRecordings);
router.get("/api/client/recordings/:recordingID", db.getRecording);
router.post("/api/client/recordings/:sessionID/new", db.createRecording);
router.put("/api/client/recordings/:recordingID/name", db.updateRecording);
router.delete("/api/client/recordings/:recordingID/delete", db.deleteRecording);
router.delete("/api/client/:clientID/sessions/:sessionID/delete", db.deleteSession);

router.get("/api/physio/:userID", db.getPhysioDetails);
router.get("/api/physio/:physioID/clients", db.getPhysioClients);
router.get("/api/physio/:physioID/sessions", db.getPhysioSessions);
router.get("/api/physio/:physioID/sessions/:clientID", db.getPhysioClientSession);
router.get("/api/physio/:physioID/recordings", db.getPhysioRecordings);
router.get("/api/physio/:physioID/recordings/:clientID", db.getPhysioClientRecordings);

module.exports = router;
