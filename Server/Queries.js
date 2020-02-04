const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const testFunc = (request, response) => {
  pool.query("SELECT * FROM test", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

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
    'SELECT "userID" FROM "User" WHERE "Username" = $1 AND "Password" = MD5($2);',
    [username, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  testFunc,
  authenticate,
  getClinics
};
