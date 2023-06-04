import { useState, useEffect, useMemo } from "react";
import { PickData } from "../../utils/PickData";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import FiltersMenu from "../../components/FiltersMenu";
import "./Analysis.scss";
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
import { PickDataDB } from "../../utils/PickDataDB";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);

// переводим численные высоты в GEO, MEO, LEO
// параметры для графиков (позволяют делать слоёные графики)
const options = {
  plugins: {
    legend: {
      display: false,
      labels: {
        color: "#3C4D5F",
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      border: {
        color: "#3C4D5F",
      },
      ticks: {
        color: "#3C4D5F",
      },
    },
    y: {
      stacked: true,
      border: {
        color: "#3C4D5F",
      },
      ticks: {
        color: "#3C4D5F",
      },
    },
  },
};

const optionsPie = {
  plugins: {
    legend: {
      labels: {
        color: "#3C4D5F",
      },
    },
  },
};

const randColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function Analysis() {
  const [chosenData, setChosenData] = useState({}); // выбранные чекбоксы
  const [currFilter, setCurrFilter] = useState([]); // текущий фильтр (назначение, страна, высота)
  const [typeGraph, setTypeGraph] = useState();
  const [chosenGraphs, setChosenGraphs] = useState([]);

  // текущие главная ось (абсцисса) и побочная (ордината)
  const [axes, setAxes] = useState({
    "Количество спутников по именам": {
      main: "name_sat",
      chart: "barchart",
    },
    "Некоторые статусы спутников по странам": {
      main: "country_op",
      secondary: "date_launch",
      chart: "barchart",
    },
  });

  const [allData, setAllData] = useState(); // данные из БД

  const [colors, setColors] = useState({});

  // данные для графиков (ключи и значения)
  const [chartData, setChartData] = useState({});

  const handleStackedGraphs = () => {
    let updatedDatasets = [];
    let keys = [];
    let firstIteration = true;
    let bgColor;
    // добавляем график, если уже выбрали что-то на другой оси
    if (chosenData[currFilter[0]].main)
      chosenData[currFilter[0]].secondary.forEach((chosenSecondary) => {
        let nums = [];
        const pickedData = [];
        // для каждого ключа с побочной оси выбираем его данные
        const promises = chosenData[currFilter[0]].main.map((chosenMain) => {
          return PickDataDB(
            [axes[currFilter[0]].main, axes[currFilter[0]].secondary],
            [chosenMain, chosenSecondary]
          ).then((oneData) => {
            pickedData.push(oneData);
            return oneData;
          });
        });
        Promise.all(promises).then((promises) => {
          Object.values(pickedData).forEach((elem) => {
            if (firstIteration) keys.push(Object.keys(elem)[0].split(",")[0]);
            nums.push(Object.values(elem)[0]);
          });
          firstIteration = false;
          if (colors[chosenSecondary]) bgColor = colors[chosenSecondary];
          else {
            bgColor = randColor();
            setColors({
              ...colors,
              [chosenSecondary]: bgColor,
            });
          }
          updatedDatasets = [
            ...updatedDatasets,
            {
              label: chosenSecondary,
              data: nums,
              backgroundColor: bgColor,
              borderColor: "white",
              borderWidth: 2,
            },
          ];

          const newChartData = Object.assign({}, chartData);
          newChartData[currFilter[0]] = {
            labels: keys,
            datasets: updatedDatasets,
          };
          setChartData(newChartData);
        });
      });
  };

  // собираем данные по выбранным чекбоксам в базе
  const collectChosenData = async () => {
    let typeGraph;
    if (currFilter && Array.isArray(currFilter) && axes[currFilter[0]]) {
      setTypeGraph(axes[currFilter[0]].chart);
      typeGraph = axes[currFilter[0]].chart;
    }

    if (typeGraph === "barchart" || typeGraph === "linechart") {
      if (
        chosenData[currFilter[0]] &&
        chosenData[currFilter[0]].secondary &&
        chosenData[currFilter[0]].secondary.length > 0
      ) {
        handleStackedGraphs();
      } else {
        if (
          chosenData[currFilter[0]] &&
          chosenData[currFilter[0]].main &&
          chosenData[currFilter[0]].main.length > 0
        ) {
          const singleAxis = chosenData[currFilter[0]].main.map((elem) => {
            return PickDataDB(axes[currFilter[0]].main, elem).then(
              (allData) => {
                return allData;
              }
            );
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
            const newChartData = Object.assign({}, chartData);
            newChartData[currFilter[0]] = {
              labels: Object.keys(singleAxisData),
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
          const newChartData = Object.assign({}, chartData);
          newChartData[currFilter[0]] = {
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
      const singleAxis = chosenData[axes[currFilter].x].map((elem) => {
        return PickDataDB(axes[currFilter].x, elem).then((allData) => {
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
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    collectChosenData();
  }, [chosenData, axes, currFilter]);

  return (
    <div className="analysis__wrapper">
      <h1 className="analysis__title">Самостоятельный анализ данных</h1>
      <FiltersMenu
        setChosenData={setChosenData}
        chosenData={chosenData}
        setCurrFilter={setCurrFilter}
        currFilter={currFilter}
        axes={axes}
        setAxes={setAxes}
        setTypeGraph={setTypeGraph}
        typeGraph={typeGraph}
        setChartData={setChartData}
        chosenGraphs={chosenGraphs}
        setChosenGraphs={setChosenGraphs}
      />
      <div className="analysis__graphs">
        {Object.keys(chosenData).map((graph) => {
          const typeGraph = axes[graph].chart;
          if (chartData[graph] && chartData[graph].labels.length > 0) {
            if (typeGraph === "piechart")
              return (
                <div className="graph__container piechart__container">
                  <PieChart
                    chartData={chartData}
                    options={optionsPie}
                    key={graph}
                    title={graph}
                  />
                </div>
              );
            if (typeGraph === "barchart")
              if (axes[graph].secondary && axes[graph].secondary.length > 0) {
                options.plugins.legend.display = true;
              } else options.plugins.legend.display = false;
            return (
              <div className="graph__container barchart__container">
                <BarChart
                  chartData={chartData[graph]}
                  options={options}
                  key={graph}
                  title={graph}
                />
              </div>
            );
            if (typeGraph === "linechart")
              return (
                <div className="graph__container linechart__container">
                  <LineChart
                    chartData={chartData[graph]}
                    options={options}
                    key={graph}
                    title={graph}
                  />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
