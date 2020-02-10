var express = require("express");
var router = express.Router();
var db = require("./Queries");

router.post("/auth", db.authenticate);
router.get("/clinics", db.getClinics);

router.get("/client/:userID", db.getClientDetails);
router.get("/client/room/:roomID", db.getRoomRecordings);
router.get("/client/:clientID/room", db.getClientRoom);
router.get("/client/:clientID/sessions", db.getClientSessions);
router.get(
  "/client/:clientID/sessions/:sessionID",
  db.getClientSessionRecordings
);
router.post("/client/sessions/new", db.createSession);
router.put("/client/sessions/update", db.updateSession);

router.get("/client/:clientID/recordings", db.getClientRecordings);
router.get("/client/recordings/:recordingID", db.getRecording);
router.post("/client/recordings/:sessionID/new", db.createRecording);
router.put("/client/recordings/:recordingID/name", db.updateRecording);
router.delete("/client/recordings/:recordingID/delete", db.deleteRecording);
router.delete("/client/:clientID/sessions/:sessionID/delete", db.deleteSession);

router.get("/physio/:userID", db.getPhysioDetails);
router.get("/physio/:physioID/clients", db.getPhysioClients);
router.get("/physio/:physioID/sessions", db.getPhysioSessions);
router.get("/physio/:physioID/sessions/:clientID", db.getPhysioClientSession);
router.get("/physio/:physioID/recordings", db.getPhysioRecordings);
router.get(
  "/physio/:physioID/recordings/:clientID",
  db.getPhysioClientRecordings
);

module.exports = router;
