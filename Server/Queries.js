const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const getClinics = (request, response) => {
  pool.query('SELECT * FROM  "Clinic"', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const authenticate = (request, response) => {
  const { username, password } = request.body;
  pool.query(
    'SELECT "userID", "UserType" FROM "User" WHERE "Username" = $1 AND "Password" = MD5($2);',
    [username, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getClientDetails = (request, response) => {
  const userID = parseInt(request.params.id);
  pool.query(
    'SELECT * FROM  "Client" WHERE "userID" = $1',
    [userID],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getClientSessions = (request, response) => {
  const clientID = parseInt(request.params.clientID);
  pool.query(
    'SELECT "Session"."sessionID", "Session"."Timestamp", "Session"."Duration" \
	  FROM "Session" \
	  INNER JOIN "Client" \
	  ON "Session"."clientID"= "Client"."clientID" \
	  WHERE "Client"."clientID" = $1;',
    [clientID],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createRecording = (request, response) => {
  const { sensorData, name, duration } = request.body;
  const sessionID = parseInt(request.params.sessionID);
  pool.query(
    'INSERT INTO "Recording"( \
	"sessionID", "timestamp", data, name, duration) \
  VALUES ($1, CURRENT_TIMESTAMP, $2, $3 , $4)',
    [sessionID, sensorData, name, duration],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPhysioDetails = (request, response) => {
  const userID = parseInt(request.params.id);
  pool.query(
    'SELECT "Physiotherapist"."Forename", "Physiotherapist"."Surname", "Clinic"."Name", "Physiotherapist"."physioID" \
	  FROM "Clinic" \
	  INNER JOIN "Physiotherapist" \
	  ON "Physiotherapist"."clinicID"= "Clinic"."clinicID" \
	  WHERE "Physiotherapist"."userID" = $1;',
    [userID],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
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
        throw error;
      }
      response.status(200).json(results.rows);
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
        throw error;
      }
      response.status(200).json(results.rows);
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
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  authenticate,
  getClinics,
  getClientDetails,
  getPhysioDetails,
  getPhysioClients,
  getClientSessions,
  getPhysioSessions,
  getPhysioClientSession,
  createRecording
};
