const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1801",
  port: 5432,
});

const getData = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM tle.satellite_info_all", (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const PickDataNew = (category, value) => {
  const firstPart = value ? `COUNT(*)` : `DISTINCT ${category}`;
  const secondPart = value ? `WHERE ${category} LIKE '${value}%'` : "";
  const queryLine = `SELECT ${firstPart} FROM tle.satellite_info_all ${secondPart}`;
  console.log(category, value);
  console.log(queryLine);
  return new Promise(function (resolve, reject) {
    pool.query(queryLine, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getData,
  PickDataNew,
};
