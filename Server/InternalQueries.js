var pool = require("./Database");

const createSession = (sessionID, clientID) => {
  pool.query(
    'INSERT INTO public."Session"("sessionID", "clientID", "Timestamp", "Duration") \
	VALUES ($1, $2, CURRENT_TIMESTAMP, 0);',
    [sessionID, clientID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      }
    }
  );
};

const updateSession = (sessionID, duration) => {
  pool.query(
    'UPDATE "Session" \
      SET "Duration" = $1 \
      WHERE "sessionID" = $2;',
    [duration, sessionID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      }
    }
  );
};

const getClientRecordings = (clientID, callback) => {
  //"Recording"."data"::json->\'data\' as Data,
  pool.query(
    'SELECT "Recording"."Name",  "Recording"."recordingID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  WHERE "Client"."clientID" = $1 \
	  ORDER BY "Recording"."Timestamp" ASC;',
    [clientID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      } else {
        callback(results.rows);
      }
    }
  );
};

const getRoomRecordings = (roomID, callback) => {
  pool.query(
    'SELECT "Recording"."Name", "Recording"."Timestamp", "Recording"."recordingID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  WHERE "Client"."roomID" = $1 \
	  ORDER BY "Recording"."Timestamp" ASC;',
    [roomID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      } else {
        callback(results.rows);
      }
    }
  );
};

const getRecording = (recordingID, callback) => {
  pool.query(
    'SELECT "data"::json->\'data\' as Data \
      FROM "Recording" \
      WHERE "recordingID" = $1;',
    [recordingID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      } else {
        try {
          callback(results.rows[0]["data"]);
        } catch {
          console.log("Undefined Error.");
        }
      }
    }
  );
};

const createRecording = (name, sensorData, sessionID, callback) => {
  pool.query(
    'INSERT INTO "Recording"("sessionID", "Timestamp", "data", "Name", "Duration") \
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3 , 21) RETURNING "Recording"."recordingID"',
    [sessionID, sensorData, name],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      } else {
        callback(results.rows[0]["recordingID"]);
      }
    }
  );
};

const updateRecording = (recordingID, newName) => {
  pool.query(
    'UPDATE "Recording" \
      SET "Name" = $1 \
      WHERE "recordingID" = $2;',
    [newName, recordingID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      }
    }
  );
};

const deleteRecording = recordingID => {
  pool.query(
    'DELETE FROM "Recording" WHERE "recordingID" = $1;',
    [recordingID],
    (error, results) => {
      if (error) {
        console.log("[DATABASE ERROR]: " + error.detail);
      }
    }
  );
};

module.exports = {
  createSession,
  updateSession,
  getClientRecordings,
  getRoomRecordings,
  getRecording,
  createRecording,
  updateRecording,
  deleteRecording
};
