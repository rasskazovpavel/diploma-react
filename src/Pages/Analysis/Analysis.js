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
import { filtersData } from "../../utils/FiltersData";
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

  // текущие главная ось (абсцисса) и побочная (ордината)
  const [axes, setAxes] = useState({
    name_sat: {
      x: "name_sat",
      chart: "barchart",
    },
    country_op: {
      x: "country_op",
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
    if (chosenData[axes.y] && chosenData[axes.x])
      chosenData[axes.y].forEach((chosenDatum) => {
        let nums = [];
        // для каждого ключа с побочной оси выбираем его данные
        let pickedData = PickData(allData, [axes.x, chosenDatum], chosenData);
        // дополняем нулевыми значениями для тех иксов, которые выбрали, но на этом конкретном игреке они нулевые
        chosenData[axes.x].forEach((label) => {
          if (!pickedData[label]) pickedData[label] = 0;
        });
        // сортируем всё по иксу
        const sortedData = Object.entries(pickedData).sort();
        // из сортированного массива массивов достаём ключи и значения
        sortedData.forEach((line) => {
          if (firstIteration) keys.push(line[0]);
          nums.push(line[1]);
        });
        firstIteration = false;
        if (colors[chosenDatum]) bgColor = colors[chosenDatum];
        else {
          bgColor = randColor();
          setColors({ ...colors, [chosenDatum]: bgColor });
        }
        updatedDatasets = [
          ...updatedDatasets,
          {
            label: chosenDatum,
            data: nums,
            backgroundColor: [bgColor],
            borderColor: "white",
            borderWidth: 2,
          },
        ];
      });
    const newChartData = {
      ...chartData,
      labels: keys,
      datasets: updatedDatasets,
    };
    setChartData(newChartData);
  };

  // собираем данные по выбранным чекбоксам в базе
  const collectChosenData = async () => {
    console.log(currFilter);
    if (currFilter && axes[currFilter]) setTypeGraph(axes[currFilter].chart);
    // если выбрали чекбокс главной оси
    if (axes[currFilter] && currFilter === axes[currFilter].x) {
      const typeGraph = axes[currFilter].chart;
      console.log(typeGraph);
      console.log("дошёл");
      if (typeGraph === "barchart" || typeGraph === "linechart") {
        if (chosenData[axes.y]) {
          // handleStackedGraphs();
        } else {
          // const singleAxisData = PickData(allData, axes.x, chosenData);
          // let bgColor;
          // console.log(colors);
          // if (colors[axes.x]) bgColor = colors[axes.x];
          // else {
          //   bgColor = randColor();
          //   setColors({ ...colors, [axes.x]: bgColor });
          // }
          // setChartData({
          //   labels: Object.keys(singleAxisData),
          //   datasets: [
          //     {
          //       label: "Количество запусков",
          //       data: Object.values(singleAxisData),
          //       backgroundColor: bgColor,
          //       borderColor: "white",
          //       borderWidth: 2,
          //     },
          //   ],
          // });
          console.log(axes[currFilter].x);
          console.log(chosenData);
          const singleAxis = chosenData[axes[currFilter].x].map((elem) => {
            console.log(elem);
            return PickDataDB(axes[currFilter].x, elem).then((allData) => {
              return allData;
            });
          });
          Promise.all(singleAxis).then((singleAxis) => {
            console.log(singleAxis);
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
            const newChartData = Object.assign({}, chartData);
            console.log(newChartData);
            newChartData[currFilter] = {
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
    }
    // если выбрали чекбокс побочной оси
    // if (currFilter === axes.y) {
    //   if (typeGraph === "barchart") {
    //     handleStackedGraphs();
    //   }
    // }
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    collectChosenData();
  }, [chosenData, axes, currFilter]);

  return (
    <div className="analysis__wrapper">
      <h1 className="analytic__title">Самостоятельный анализ данных</h1>
      {/* {allData && ( */}
      <FiltersMenu
        setChosenData={setChosenData}
        chosenData={chosenData}
        setCurrFilter={setCurrFilter}
        currFilter={currFilter}
        allData={allData}
        axes={axes}
        setAxes={setAxes}
        setTypeGraph={setTypeGraph}
        typeGraph={typeGraph}
        setChartData={setChartData}
      />
      {/* )} */}
      <div className="analysis__graphs">
        {Object.keys(chosenData).map((graph) => {
          const typeGraph = axes[graph].chart;
          console.log(chosenData, chartData);
          if (chartData[graph]) {
            if (typeGraph === "piechart")
              return (
                <PieChart
                  chartData={chartData}
                  options={optionsPie}
                  key={graph}
                />
              );
            if (typeGraph === "barchart")
              return (
                <BarChart
                  chartData={chartData[graph]}
                  options={options}
                  key={graph}
                />
              );
            if (typeGraph === "linechart")
              return (
                <LineChart
                  chartData={chartData[graph]}
                  options={options}
                  key={graph}
                />
              );
          }
        })}
      </div>
    </div>
  );
}
