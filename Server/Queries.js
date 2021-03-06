var pool = require("./Database");

const getClinics = (request, response) => {
  pool.query('SELECT * FROM  "Clinic"', (error, results) => {
    if (error) {
      throw error;
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const authenticate = (request, response) => {
  const { username, password } = request.body;
  pool.query(
    'SELECT "userID", "UserType" FROM "User" WHERE "Username" = $1 AND "Password" = MD5($2);',
    [username, password],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.rowCount == 0) {
        response.status(401).send("Incorrect Login Details.");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getClientDetails = (request, response) => {
  const userID = parseInt(request.params.userID);
  console.log(userID, request.params);
  pool.query(
    'SELECT * FROM  "Client" WHERE "userID" = $1',
    [userID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getClientRoom = (request, response) => {
  const clientID = parseInt(request.params.clientID);
  pool.query(
    'SELECT "roomID" FROM "Client" WHERE "Client"."clientID" = $1',
    [clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getClientSessions = (request, response) => {
  const clientID = parseInt(request.params.clientID);
  pool.query(
    'SELECT "Session"."sessionID", "Session"."Timestamp", "Session"."Duration", "Physiotherapist"."Forename", "Physiotherapist"."Surname" \
	  FROM "Session" \
	  INNER JOIN "Client" \
	  ON "Session"."clientID"= "Client"."clientID" \
	  INNER JOIN "Physiotherapist" \
	  ON "Client"."physioID" = "Physiotherapist"."physioID" \
	  WHERE "Client"."clientID" = $1 \
	  ORDER BY "Session"."Timestamp" DESC;',
    [clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getClientSessionRecordings = (request, response) => {
  const clientID = parseInt(request.params.clientID);
  const sessionID = parseInt(request.params.sessionID);
  // "Recording"."data",
  pool.query(
    'SELECT "Recording"."Name", "Recording"."recordingID","Recording"."Timestamp" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  WHERE "Client"."clientID" = $1 \
	  AND "Session"."sessionID" = $2 \
	  ORDER BY "Recording"."Timestamp" DESC;',
    [clientID, sessionID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getClientRecordings = (request, response) => {
  const clientID = parseInt(request.params.clientID);
  //"Recording"."data"
  pool.query(
    'SELECT "Recording"."Name", "Recording"."Timestamp", "Recording"."recordingID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  WHERE "Client"."clientID" = $1 \
	  ORDER BY "Recording"."Timestamp" DESC;',
    [clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getRoomRecordings = (request, response) => {
  const roomID = parseInt(request.params.roomID);
  pool.query(
    'SELECT "Recording"."Name", "Recording"."Timestamp", "Recording"."recordingID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  WHERE "Client"."roomID" = $1 \
	  ORDER BY "Recording"."Timestamp" DESC;',
    [roomID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const createRecording = (request, response) => {
  const { sensorData, name, duration } = request.body;
  const sessionID = parseInt(request.params.sessionID);
  pool.query(
    'INSERT INTO "Recording"("sessionID", "Timestamp", data, Name, Duration) \
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3 , $4)',
    [sessionID, sensorData, name, duration],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const deleteRecording = (request, response) => {
  const recordingID = parseInt(request.params.recordingID);
  pool.query(
    'DELETE FROM "Recording" WHERE "recordingID" = $1;',
    [recordingID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const updateRecording = (request, response) => {
  const recordingID = parseInt(request.params.recordingID);
  const newName = request.query.name;
  pool.query(
    'UPDATE "Recording" \
      SET "name" = $1 \
      WHERE "recordingID" = $2;',
    [recordingID, newName],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getRecording = (request, response) => {
  const recordingID = parseInt(request.params.recordingID);
  pool.query(
    'SELECT "data" -> \'data\' AS sensorData \
      FROM "Recording" \
      WHERE "recordingID" = $1;',
    [recordingID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const deleteSession = (request, response) => {
  const sessionID = parseInt(request.params.sessionID);
  pool.query(
    'DELETE FROM "Session" WHERE "sessionID" = $1;',
    [sessionID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const createSession = (request, response) => {
  const { sessionID, clientID } = request.body;
  pool.query(
    'INSERT INTO public."Session"("sessionID", "clientID", "Timestamp", "Duration") \
	VALUES ($1, $2, CURRENT_TIMESTAMP, 0);',
    [sessionID, clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const updateSession = (request, response) => {
  const sessionID = parseInt(request.params.sessionID);
  const duration = request.query.duration;
  pool.query(
    'UPDATE "Session" \
      SET "Duration" = $1 \
      WHERE "sessionID" = $2;',
    [duration, sessionID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioDetails = (request, response) => {
  const userID = parseInt(request.params.userID);
  pool.query(
    'SELECT "Physiotherapist"."Forename", "Physiotherapist"."Surname", "Clinic"."Name", "Physiotherapist"."physioID" \
	  FROM "Clinic" \
	  INNER JOIN "Physiotherapist" \
	  ON "Physiotherapist"."clinicID"= "Clinic"."clinicID" \
	  WHERE "Physiotherapist"."userID" = $1;',
    [userID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioClients = (request, response) => {
  const physioID = parseInt(request.params.physioID);
  pool.query(
    'SELECT "Client"."clientID", "Client"."Forename", "Client"."Surname", "Client"."DoB", "Client"."roomID" \
	  FROM "Client" \
	  INNER JOIN "Physiotherapist" \
	  ON "Physiotherapist"."physioID"= "Client"."physioID" \
	  WHERE "Physiotherapist"."physioID" = $1;',
    [physioID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioSessions = (request, response) => {
  const physioID = parseInt(request.params.physioID);
  pool.query(
    'SELECT "Session"."sessionID", "Session"."Timestamp", "Session"."Duration", "Client"."Forename", "Client"."Surname", "Client"."clientID" \
	  FROM "Session" \
	  INNER JOIN "Client" \
	  ON "Session"."clientID"= "Client"."clientID" \
	  INNER JOIN "Physiotherapist" \
	  ON "Client"."physioID" = "Physiotherapist"."physioID" \
	  WHERE "Physiotherapist"."physioID" = $1 \
	  ORDER BY "Session"."Timestamp" DESC;',
    [physioID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioClientSession = (request, response) => {
  const physioID = parseInt(request.params.physioID);
  const clientID = parseInt(request.params.clientID);
  pool.query(
    'SELECT "Session"."sessionID", "Session"."Timestamp", "Session"."Duration", "Client"."Forename", "Client"."Surname" \
	  FROM "Session" \
	  INNER JOIN "Client" \
	  ON "Session"."clientID"= "Client"."clientID" \
	  INNER JOIN "Physiotherapist" \
	  ON "Client"."physioID" = "Physiotherapist"."physioID" \
	  WHERE "Physiotherapist"."physioID" = $1 \
	  AND "Client"."clientID" = $2 \
	  ORDER BY "Session"."Timestamp" DESC;',
    [physioID, clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioRecordings = (request, response) => {
  const physioID = parseInt(request.params.physioID);
  //"Recording"."data",
  pool.query(
    'SELECT "Recording"."Name", "Client"."Forename", "Client"."Surname","Recording"."recordingID","Recording"."Timestamp", "Recording"."sessionID",  "Client"."clientID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  INNER JOIN "Physiotherapist" \
	  ON "Client"."physioID" = "Physiotherapist"."physioID" \
	  WHERE "Physiotherapist"."physioID" = $1 \
	  ORDER BY "Recording"."Timestamp" DESC;',
    [physioID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getPhysioClientRecordings = (request, response) => {
  const physioID = parseInt(request.params.physioID);
  const clientID = parseInt(request.params.clientID);
  pool.query(
    'SELECT "Recording"."Name","Recording"."recordingID","Recording"."Timestamp","Recording"."data", "Recording"."sessionID" \
	  FROM "Recording" \
	  INNER JOIN "Session" \
	  ON "Recording"."sessionID"= "Session"."sessionID" \
	  INNER JOIN "Client" \
	  ON "Client"."clientID" = "Session"."clientID" \
	  INNER JOIN "Physiotherapist" \
	  ON "Client"."physioID" = "Physiotherapist"."physioID" \
	  WHERE "Physiotherapist"."physioID" = $1 \
	  AND "Client"."clientID" = $2 \
	  ORDER BY "Recording"."Timestamp" DESC;',
    [physioID, clientID],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

module.exports = {
  authenticate,
  getClinics,
  getRoomRecordings,
  getClientDetails,
  getClientSessions,
  getClientRecordings,
  getClientSessionRecordings,
  getPhysioDetails,
  getPhysioClients,
  getPhysioSessions,
  getPhysioClientSession,
  getPhysioRecordings,
  getPhysioClientRecordings,
  getRecording,
  createRecording,
  deleteRecording,
  updateRecording,
  deleteSession,
  createSession,
  updateSession,
  getClientRoom
};
