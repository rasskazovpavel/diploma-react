import { useState, useEffect } from "react";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import FiltersMenu from "../../components/FiltersMenu";
import { TableCodes } from "../../utils/TableCodes";
import { randColor } from "../../utils/UtilsFunctions";
import { AllColors } from "../../utils/AllColors";
import { PickDataDB } from "../../utils/PickDataDB";
import { ChartOptions } from "../../utils/ChartOptions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Constructor.scss";
import "../../App.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);

const exportPDF = (e) => {
  const but = e.target;
  let input = window.document.getElementsByClassName("chart-container")[0];
  let container = window.document.getElementsByClassName(
    "constructor__graphs"
  )[0];
  html2canvas(input).then((canvas) => {
    const pdf = new jsPDF("l", "pt");
    const img = canvas.toDataURL("image/png");
    pdf.addImage(
      img,
      "png",
      input.offsetLeft - container.offsetLeft,
      input.offsetTop - container.offsetTop,
      input.style.width,
      input.style.height
    );
    but.style.display = "block";
    pdf.save("chart.pdf");
  });
};

export default function Constructor() {
  const [chosenData, setChosenData] = useState({});
  const [typeGraph, setTypeGraph] = useState();

  const [axes, setAxes] = useState({
    x: "",
    y: "",
  });

  const [colors, setColors] = useState({});

  const [chartData, setChartData] = useState({});

  const handleStackedGraphs = () => {
    let updatedDatasets = [];
    let keys = [];
    let firstIteration = true;
    let bgColor;
    if (chosenData.secondary && chosenData.main)
      chosenData.secondary.forEach((chosenSecondary) => {
        let nums = [];
        const pickedData = [];
        const promises = chosenData.main.map((chosenMain) => {
          return PickDataDB(
            [axes.x, axes.y],
            [chosenMain, chosenSecondary],
            ""
          ).then((oneData) => {
            pickedData.push(oneData);
            return oneData;
          });
        });
        Promise.all(promises).then(() => {
          const sortedPickedData = pickedData.sort((a, b) =>
            Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1
          );
          Object.values(sortedPickedData).forEach((elem) => {
            if (firstIteration) keys.push(Object.keys(elem)[0].split(",")[0]);
            nums.push(Object.values(elem)[0]);
          });
          firstIteration = false;
          if (AllColors[axes.y] && AllColors[axes.y][chosenSecondary])
            bgColor = AllColors[axes.y][chosenSecondary];
          else if (colors[chosenSecondary]) {
            bgColor = colors[chosenSecondary];
          } else {
            bgColor = randColor();
          }
          setColors({
            ...colors,
            [chosenSecondary]: bgColor,
          });
          const mappedLabel =
            TableCodes[axes.y] && TableCodes[axes.y][chosenSecondary]
              ? TableCodes[axes.y][chosenSecondary]
              : chosenSecondary;
          updatedDatasets = [
            ...updatedDatasets,
            {
              label: mappedLabel,
              data: nums,
              backgroundColor: bgColor,
              borderColor: bgColor,
              borderWidth: 2,
            },
          ];

          const newChartData = {
            labels: keys.map(
              (key) => (TableCodes[axes.x] && TableCodes[axes.x][key]) || key
            ),
            datasets: updatedDatasets,
          };
          setChartData(newChartData);
        });
      });
  };

  const collectChosenData = async () => {
    if (typeGraph === "barchart" || typeGraph === "linechart") {
      if (
        chosenData &&
        chosenData.secondary &&
        chosenData.secondary.length > 0
      ) {
        handleStackedGraphs();
      } else {
        if (chosenData && chosenData.main && chosenData.main.length > 0) {
          const singleAxis = chosenData.main.map((elem) => {
            return PickDataDB(axes.x, elem, "").then((allData) => {
              return allData;
            });
          });
          Promise.all(singleAxis).then((singleAxis) => {
            const singleAxisData = {};
            singleAxis.map((elem) => {
              if (colors[Object.keys(elem)[0]])
                singleAxisData[Object.keys(elem)[0]] = [
                  Object.values(elem)[0],
                  colors[Object.keys(elem)[0]],
                ];
              else {
                let bgColor;
                if (
                  AllColors[axes.x] &&
                  AllColors[axes.x][Object.keys(elem)[0]]
                ) {
                  bgColor = AllColors[axes.x][Object.keys(elem)[0]];
                } else if (colors[[Object.keys(elem)[0]]]) {
                  bgColor = colors[Object.keys(elem)[0]];
                } else {
                  bgColor = randColor();
                }
                let newColors = {
                  ...colors,
                  [Object.keys(elem)[0]]: bgColor,
                };
                setColors(newColors);
                singleAxisData[Object.keys(elem)[0]] = [
                  Object.values(elem)[0],
                  bgColor,
                ];
              }
            });
            const values = Object.values(singleAxisData).map((pair) => pair[0]);
            const colorsChart = Object.values(singleAxisData).map(
              (pair) => pair[1]
            );
            const mappedLabels = Object.keys(singleAxisData).map((label) =>
              TableCodes[axes.x] && TableCodes[axes.x][label]
                ? TableCodes[axes.x][label]
                : label
            );
            const newChartData = {
              labels: mappedLabels,
              datasets: [
                {
                  label: "Количество запусков",
                  data: values,
                  backgroundColor: colorsChart,
                  borderWidth: 2,
                },
              ],
            };
            setChartData(newChartData);
          });
        } else {
          const newChartData = {
            labels: [],
            datasets: [
              {
                label: "Количество запусков",
                data: [],
                backgroundColor: [],
                borderWidth: 2,
              },
            ],
          };
          setChartData(newChartData);
        }
      }
    }
    if (typeGraph === "piechart") {
      if (chosenData && chosenData.main) {
        const singleAxis = chosenData.main.map((elem) => {
          return PickDataDB(axes.x, elem, "").then((allData) => {
            return allData;
          });
        });
        Promise.all(singleAxis).then((singleAxis) => {
          const singleAxisData = {};
          singleAxis.map((elem) => {
            if (colors[Object.keys(elem)[0]])
              singleAxisData[Object.keys(elem)[0]] = [
                Object.values(elem)[0],
                colors[Object.keys(elem)[0]],
              ];
            else {
              let bgColor = randColor();
              let newColors = { ...colors, [Object.keys(elem)[0]]: bgColor };
              setColors(newColors);
              singleAxisData[Object.keys(elem)[0]] = [
                Object.values(elem)[0],
                bgColor,
              ];
            }
          });
          const values = Object.values(singleAxisData).map((pair) => pair[0]);
          const colorsChart = Object.values(singleAxisData).map(
            (pair) => pair[1]
          );

          setChartData({
            labels: Object.keys(singleAxisData),
            datasets: [
              {
                label: "Количество запусков",
                data: values,
                backgroundColor: colorsChart,
                borderWidth: 2,
              },
            ],
          });
        });
      }
    }
  };

  useEffect(() => {
    collectChosenData();
  }, [chosenData, axes]);

  return (
    <div className="constructor__wrapper">
      <h1 className="constructor__title">Самостоятельный анализ данных</h1>
      <FiltersMenu
        setChosenData={setChosenData}
        chosenData={chosenData}
        axes={axes}
        setAxes={setAxes}
        setTypeGraph={setTypeGraph}
        typeGraph={typeGraph}
        setChartData={setChartData}
      />
      {chartData && chartData.labels && chartData.labels.length > 0 && (
        <div className="constructor__graphs">
          {typeGraph === "piechart" && (
            <div className="graph__container piechart__container">
              <PieChart
                chartData={chartData}
                options={ChartOptions().optionsPie}
                title="Круговая диаграмма"
              />
            </div>
          )}
          {typeGraph === "barchart" && axes.y && axes.y.length > 0 && (
            <div className="graph__container barchart__container">
              <BarChart
                chartData={chartData}
                options={ChartOptions().optionsBarStacked}
                title="Столбчатая диаграмма"
              />
            </div>
          )}
          {typeGraph === "barchart" && !axes.y && (
            <div className="graph__container barchart__container">
              <BarChart
                chartData={chartData}
                options={ChartOptions().optionsBar}
                title="Столбчатая диаграмма"
              />
            </div>
          )}
          {typeGraph === "linechart" && (
            <div className="graph__container linechart__container">
              <LineChart
                chartData={chartData}
                options={ChartOptions().optionsLine}
                title="Линейная диаграмма"
              />
            </div>
          )}
          <button className="constructor__pdf" onClick={exportPDF}>
            Экспортировать в PDF
          </button>
        </div>
      )}
    </div>
  );
}
