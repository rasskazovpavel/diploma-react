import { useEffect } from "react";

export const PickDataDB = (category, value, current = undefined) => {
  // console.log(category, value);
  return fetch(`http://localhost:3001?cat=${category}&val=${value}`, {
    category: category,
    value: value,
    current: current,
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let newData = JSON.parse(data).rows;
      if (!value) {
        if (category === "name_sat") {
          const newDataValues = newData.map(
            ({ name_sat }) => name_sat.split(" ")[0].split("-")[0]
          );
          newData = newDataValues.reduce((acc, val) => {
            if (!Object.keys(acc).includes(val)) acc[val] = 1;
            else acc[val] += 1;
            return acc;
          }, {});
        } else if (category === "date_launch") {
          const newDataValues = newData.map(
            ({ date_launch }) => date_launch.split("-")[0]
          );
          newData = newDataValues.reduce((acc, val) => {
            if (!Object.keys(acc).includes(val)) acc[val] = 1;
            else acc[val] += 1;
            return acc;
          }, {});
        } else {
          const newDataValues = newData.map(
            (categoryObj) => categoryObj[category]
          );
          newData = newDataValues.reduce((acc, val) => {
            if (!Object.keys(acc).includes(val)) acc[val] = 1;
            else acc[val] += 1;
            return acc;
          }, {});
        }
      } else {
        newData = { [value]: newData[0]["count"] };
      }
      return newData;
    });
};
