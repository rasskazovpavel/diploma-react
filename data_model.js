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
    pool.query("SELECT * FROM tle.satellites_info_new", (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const PickData = (category, value, current) => {
  let queryLine;
  const categories = category.split(",");
  const values = value.split(",");
  const isCurrent =
    current === "orbit"
      ? `ddate = '-'`
      : current === "deorbit"
      ? `ddate <> '-'`
      : "";
  if (categories.length > 1) {
    let conditions = ``;
    categories.forEach((cat, index) => {
      conditions = conditions + `${cat} LIKE '${values[index]}%' AND `;
    });
    queryLine = `SELECT COUNT(*) FROM tle.satellites_info_new WHERE ${conditions.slice(
      0,
      -5
    )}${isCurrent !== "" ? `AND ${isCurrent}` : ""}`;
  } else {
    if (category === "name" && value) {
      queryLine = `SELECT COUNT(*) FROM tle.satellites_info_new WHERE ${category} LIKE '${value}%'`;
    } else {
      const firstPart = value ? `COUNT(*)` : `DISTINCT ${category}`;
      const secondPart = value ? `WHERE ${category} = '${value}'` : "";
      const thirdPart =
        isCurrent !== ""
          ? secondPart !== ""
            ? `AND ${isCurrent}`
            : `WHERE ${isCurrent}`
          : "";
      queryLine = `SELECT ${firstPart} FROM tle.satellites_info_new ${secondPart} ${thirdPart}`;
    }
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
  PickData,
};
