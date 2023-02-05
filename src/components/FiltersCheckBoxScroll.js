import React, { useEffect, useState } from "react";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
import { PickData } from "../utils/PickData";
import { logDOM } from "@testing-library/react";

const FiltersCheckBoxScroll = (
  dataCategory,
  i,
  chosenData,
  setChosenData,
  setCurrFilter
) => {
  console.log(chosenData);
  const [data, setData] = useState(
    PickData(dataCategory.id)[0].map((item) => {
      return { unit: item };
    })
  );
  const [parentChecked, setParentChecked] = useState(false);

  const updateChosenData = (currData, i) => {
    setCurrFilter(dataCategory.id);
    if (currData.every((line) => line.isChecked === true)) {
      setParentChecked(true);
    } else setParentChecked(false);
    const selectedData = currData.reduce((acc, line) => {
      if (line.isChecked) {
        acc.push(line.unit);
      }
      return acc;
    }, []);
    let updData = selectedData;
    console.log(updData);
    console.log(chosenData);
    setChosenData(updData);
  };

  const changeCheckboxStatus = (i) => {
    const currData = data.map((line, order) =>
      order === i ? { unit: data[i].unit, isChecked: !data[i].isChecked } : line
    );

    updateChosenData(currData);
    setData(currData);

    // setData(
    //   data.map((line, order) =>
    //     order === i
    //       ? { unit: data[i].unit, isChecked: !data[i].isChecked }
    //       : line
    //   )
    // );
  };

  const changeParentCheckbox = (e) => {
    setParentChecked(e.currentTarget.checked);
    const currData = data.map((line, order) => {
      return { unit: data[order].unit, isChecked: e.currentTarget.checked };
    });
    updateChosenData(currData);
    setData(currData);

    // setData(
    //   data.map((line, order) => {
    //     return { unit: data[order].unit, isChecked: e.currentTarget.checked };
    //   })
    // );
  };

  // useEffect(() => {
  //   if (data.every((line) => line.isChecked === true)) {
  //     setParentChecked(true);
  //   } else setParentChecked(false);
  //   const selectedData = data.reduce((acc, line) => {
  //     if (line.isChecked) {
  //       acc.push(line.unit);
  //     }
  //     return acc;
  //   }, []);
  //   let updData = chosenData;
  //   updData[i] = selectedData;
  //   console.log(updData);
  //   setChosenData(updData);
  // }, [data]);

  return (
    <ul>
      <li>
        <input
          type="checkbox"
          value="parent"
          onChange={(e) => changeParentCheckbox(e)}
          checked={parentChecked}
        />
        {dataCategory.name}
      </li>
      <ReactIScroll
        className="filters_menu__scroll_wrapper"
        iScroll={iScroll}
        options={{
          mouseWheel: true,
          scrollbars: true,
          interactiveScrollbars: true,
        }}
      >
        <ul>
          {data.map((line, i) => {
            return (
              <li>
                <input
                  type="checkbox"
                  value="child"
                  onChange={() => changeCheckboxStatus(i)}
                  checked={line.isChecked}
                />
                {line.unit}
              </li>
            );
          })}
        </ul>
      </ReactIScroll>
    </ul>
  );
};
export default FiltersCheckBoxScroll;
