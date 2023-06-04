import "./style.css";
import { useState, useEffect } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./Filters/FiltersCheckBox";
import FiltersCheckBoxScroll from "./Filters/FiltersCheckBoxScroll";
import FiltersAxes from "./Filters/FiltersAxes";
import FiltersSlider from "./Filters/FiltersSlider";
import FiltersTypeGraph from "./Filters/FiltersTypeGraph";

import "./FiltersMenu.scss";
// const pdfConverter = require("jspdf");

const FiltersMenu = ({
  setChosenData,
  setCurrFilter,
  currFilter,
  allData,
  chosenData,
  axes,
  setAxes,
  setTypeGraph,
  typeGraph,
  setChartData,
  chartData,
  setChosenGraphs,
  chosenGraphs,
}) => {
  return (
    <div className="filters_menu">
      <h3 className="filters_menu__title">Настройки</h3>
      <div className="filters_menu__container">
        {filtersData.map((line) => {
          // if (line.type === "checkbox") {
          //   return (
          //     <FiltersCheckBox
          //       filtersDataItem={line}
          //       setChosenData={setChosenData}
          //       setCurrFilter={setCurrFilter}
          //       key={line.id.main}
          //     />
          //   );
          // }
          if (line.type === "checkbox-scroll") {
          }
          return (
            <FiltersCheckBoxScroll
              filtersDataItem={line}
              setChosenData={setChosenData}
              chosenData={chosenData}
              setCurrFilter={setCurrFilter}
              currFilter={currFilter}
              key={line.id.main}
              allData={allData}
              graphId={line.id}
              dropdown={line.dropdown}
              setChartData={setChartData}
              chartData={chartData}
              chosenGraphs={chosenGraphs}
              setChosenGraphs={setChosenGraphs}
            />
          );
        })}
      </div>
    </div>
  );
};
export default FiltersMenu;
