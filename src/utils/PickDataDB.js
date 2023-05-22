import { useEffect } from "react";

export const PickDataDB = (category, value) => {
  console.log(category, value);
  return fetch(`http://localhost:3001?cat=${category}&val=${value}`, {
    category: category,
    value: value,
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
        console.log(newData[0]);
        // const newDataValues = newData.map((line) => {
        //   return { [value]: line["count"] };
        // });
        newData = { [value]: newData[0]["count"] };
      }
      return newData;
    });
};
