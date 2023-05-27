import "./style.css";
import { useState, useEffect } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./Filters/FiltersCheckBox";
import FiltersCheckBoxScroll from "./Filters/FiltersCheckBoxScroll";
import FiltersAxes from "./Filters/FiltersAxes";
import FiltersSlider from "./Filters/FiltersSlider";
import FiltersTypeGraph from "./Filters/FiltersTypeGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const div2PDF = (e) => {
    const but = e.target;
    but.style.display = "none";
    let input = window.document.getElementsByClassName("chart-container")[0];

    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "pt");
      pdf.setFillColor(0, 0, 0, 1);
      pdf.rect(10, 10, 150, 160, "F");
      pdf.addImage(
        img,
        "png",
        input.offsetLeft,
        input.offsetTop,
        input.clientWidth,
        input.clientHeight
      );
      pdf.save("chart.pdf");
      but.style.display = "block";
    });
  };
  return (
    <div className="filters_menu">
      <h3>Настройки</h3>
      {console.log("here")}
      {/* <FiltersTypeGraph
        setTypeGraph={setTypeGraph}
        setAxes={setAxes}
        setChosenData={setChosenData}
        setChartData={setChartData}
      />
      {typeGraph && (
        <FiltersAxes axes={axes} setAxes={setAxes} typeGraph={typeGraph} />
      )} */}
      {filtersData.map((line) => {
        // if (Object.values(axes).includes(line.id)) {
        if (line.type === "checkbox") {
          return (
            <FiltersCheckBox
              filtersDataItem={line}
              setChosenData={setChosenData}
              setCurrFilter={setCurrFilter}
              key={line.id.main}
            />
          );
        }
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
        // }
        // if (line.type === "slider") return FiltersSlider(line);
      })}
      <button className="pdf__button" onClick={(e) => div2PDF(e)}>
        Экспортировать в PDF
      </button>
    </div>
  );
};
export default FiltersMenu;
