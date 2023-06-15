import { useEffect } from "react";

export const PickDataDB = (category, value, current = "no") => {
  // console.log(category, value);
  return fetch(
    `http://localhost:3001?cat=${category}&val=${value}&curr=${current}`,
    {
      category: category,
      value: value,
      current: current,
    }
  )
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let newData = JSON.parse(data).rows;
      // console.log(newData);
      if (!value) {
        if (category === "name") {
          const newDataValues = newData.map(
            ({ name }) => name.split(" ")[0].split("-")[0]
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
