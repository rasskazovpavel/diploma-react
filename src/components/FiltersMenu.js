import "./style.css";
import { useState, useEffect } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./Filters/FiltersCheckBox";
import FiltersCheckBoxScroll from "./Filters/FiltersCheckBoxScroll";
import FiltersAxes from "./Filters/FiltersAxes";
import FiltersSlider from "./Filters/FiltersSlider";

const FiltersMenu = ({
  setChosenData,
  setCurrFilter,
  currFilter,
  allData,
  chosenData,
  axes,
  setAxes,
}) => {
  return (
    <div className="filters_menu">
      <FiltersAxes axes={axes} setAxes={setAxes} />
      {filtersData.map((line, i) => {
        if (line.type === "checkbox") {
          return (
            <FiltersCheckBox
              filtersDataItem={line}
              setChosenData={setChosenData}
              setCurrFilter={setCurrFilter}
              key={i}
            />
          );
        }
        if (line.type === "checkbox-scroll")
          return (
            <FiltersCheckBoxScroll
              filtersDataItem={line}
              setChosenData={setChosenData}
              chosenData={chosenData}
              setCurrFilter={setCurrFilter}
              currFilter={currFilter}
              key={i}
              allData={allData}
            />
          );
        // if (line.type === "slider") return FiltersSlider(line);
      })}
    </div>
  );
};
export default FiltersMenu;
