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

module.exports = {
  testFunc
};
