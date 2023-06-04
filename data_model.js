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

const PickDataNew = (category, value, current) => {
  let queryLine;
  const categories = category.split(",");
  const values = value.split(",");
  const isCurrent =
    current === "orbit"
      ? `WHERE DDate = '-'`
      : current === "deorbit"
      ? `WHERE DDate <> '-'`
      : "";
  if (categories.length > 1) {
    let conditions = ``;
    categories.forEach((cat, index) => {
      if (cat === "date_launch") {
        console.log(cat, cat.length);
        conditions =
          conditions +
          `date_launch >= '${values[index]}-01-01' AND date_launch <= '${values[index]}-12-31' AND `;
      } else conditions = conditions + `${cat} LIKE '${values[index]}%' AND `;
    });
    queryLine = `SELECT COUNT(*) FROM tle.satellite_info_all WHERE ${conditions.slice(
      0,
      -5
    )} ${isCurrent}`;
  } else {
    const firstPart = value ? `COUNT(*)` : `DISTINCT ${category}`;
    const secondPart = value
      ? category === "date_launch"
        ? `WHERE date_launch >= '${value}-01-01' AND date_launch <= '${value}-12-31'`
        : `WHERE ${category} LIKE '${value}%'`
      : "";
    queryLine = `SELECT ${firstPart} FROM tle.satellite_info_all ${secondPart} ${isCurrent}`;
  }
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
