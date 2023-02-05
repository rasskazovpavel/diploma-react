import "./style.css";
import { useState, useEffect } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./FiltersCheckBox";
import FiltersCheckBoxScroll from "./FiltersCheckBoxScroll";
import FiltersSlider from "./FiltersSlider";

function FiltersMenu({ setChosenData, setCurrFilter, currFilter, SATS }) {
  return (
    <div className="filters_menu">
      {filtersData.map((line, i) => {
        console.log(i);
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
              setCurrFilter={setCurrFilter}
              currFilter={currFilter}
              SATS={SATS}
              key={i}
            />
          );
        // if (line.type === "slider") return FiltersSlider(line);
      })}
    </div>
  );
}
export default FiltersMenu;
