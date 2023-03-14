const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1801",
  port: 5432,
});

const getMerchants = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM tle.satellite_info_all", (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getMerchants,
};
