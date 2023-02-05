import "./style.css";
import { useState, useEffect } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./FiltersCheckBox";
import FiltersCheckBoxScroll from "./FiltersCheckBoxScroll";
import FiltersSlider from "./FiltersSlider";

function FiltersMenu({ chosenData, setChosenData, setCurrFilter }) {
  return (
    <div className="filters_menu">
      {filtersData.map((line, i) => {
        if (line.type === "checkbox") {
          return FiltersCheckBox(line, i, setChosenData);
        }
        if (line.type === "checkbox-scroll")
          return FiltersCheckBoxScroll(
            line,
            i,
            chosenData,
            setChosenData,
            setCurrFilter
          );
        // if (line.type === "slider") return FiltersSlider(line);
      })}
    </div>
  );
}
export default FiltersMenu;
