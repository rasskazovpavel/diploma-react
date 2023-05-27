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
      // display: false,
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
        console.log([axes[currFilter[0]].main, axes[currFilter[0]].secondary]);
        const promises = chosenData[currFilter[0]].main.map((chosenMain) => {
          return PickDataDB(
            [axes[currFilter[0]].main, axes[currFilter[0]].secondary],
            [chosenMain, chosenSecondary]
          ).then((oneData) => {
            console.log(oneData);
            pickedData.push(oneData);
            return oneData;
            // console.log(pickedData.length);
          });
        });
        Promise.all(promises).then((promises) => {
          console.log(promises);
          // keys.push(chosenSecondary);
          Object.values(pickedData).forEach((elem) => {
            console.log(Object.keys(elem)[0].split(",")[0]);
            if (firstIteration) keys.push(Object.keys(elem)[0].split(",")[0]);
            nums.push(Object.values(elem)[0]);
          });
          firstIteration = false;
          console.log(keys, nums, chosenSecondary);
          console.log(colors);
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
          console.log(updatedDatasets);
          console.log(updatedDatasets);

          const newChartData = Object.assign({}, chartData);
          newChartData[currFilter[0]] = {
            labels: keys,
            datasets: updatedDatasets,
          };
          // const newChartData = {
          //   ...chartData,
          //   labels: keys,
          //   datasets: updatedDatasets,
          // };
          console.log(newChartData);
          setChartData(newChartData);
        });
        // дополняем нулевыми значениями для тех иксов, которые выбрали, но на этом конкретном игреке они нулевые
        // chosenData[axes.x].forEach((label) => {
        //   if (!pickedData[label]) pickedData[label] = 0;
        // });
        // сортируем всё по иксу
        // const sortedData = Object.entries(pickedData).sort();
        // из сортированного массива массивов достаём ключи и значения
        // sortedData.forEach((line) => {
        //   if (firstIteration) keys.push(line[0]);
        //   nums.push(line[1]);
        // });
        // firstIteration = false;
        //
        // else {
        //   bgColor = randColor();
        //   setColors({ ...colors, [chosenDatum]: bgColor });
        // }
        // updatedDatasets = [
        //   ...updatedDatasets,
        //   {
        //     label: chosenDatum,
        //     data: nums,
        //     backgroundColor: [bgColor],
        //     borderColor: "white",
        //     borderWidth: 2,
        //   },
        // ];
      });
    // console.log(updatedDatasets);

    // const newChartData = Object.assign({}, chartData);
    // newChartData[currFilter[0]] = {
    //   labels: keys,
    //   datasets: updatedDatasets,
    // };
    // // const newChartData = {
    // //   ...chartData,
    // //   labels: keys,
    // //   datasets: updatedDatasets,
    // // };
    // console.log(newChartData);
    // setChartData(newChartData);
  };

  // собираем данные по выбранным чекбоксам в базе
  const collectChosenData = async () => {
    console.log(currFilter);
    let typeGraph;
    if (currFilter && Array.isArray(currFilter) && axes[currFilter[0]]) {
      setTypeGraph(axes[currFilter[0]].chart);
      typeGraph = axes[currFilter[0]].chart;
    }
    console.log(currFilter);
    // если выбрали чекбокс главной оси
    // if (axes[currFilter] && currFilter === axes[currFilter].x) {

    console.log(typeGraph);
    if (typeGraph === "barchart" || typeGraph === "linechart") {
      console.log(chosenData);
      if (
        chosenData[currFilter[0]] &&
        chosenData[currFilter[0]].secondary &&
        chosenData[currFilter[0]].secondary.length > 0
      ) {
        console.log("погнали");
        handleStackedGraphs();
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
        console.log(axes[currFilter[0]].x);
        console.log(chosenData);
        if (
          chosenData[currFilter[0]] &&
          chosenData[currFilter[0]].main &&
          chosenData[currFilter[0]].main.length > 0
        ) {
          console.log(chosenData[currFilter[0]][currFilter[1]]);
          console.log(chosenData, axes[currFilter[0]]);
          const singleAxis = chosenData[currFilter[0]].main.map((elem) => {
            console.log(elem);
            return PickDataDB(axes[currFilter[0]].main, elem).then(
              (allData) => {
                return allData;
              }
            );
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
            // const updDatasets = Object.values(singleAxisData).map((pair, i) => {
            //   return {
            //     label: Object.keys(singleAxisData)[i],
            //     data: pair[0],
            //     backgroundColor: pair[1],
            //     borderWidth: 2,
            //   };
            // });
            const newChartData = Object.assign({}, chartData);
            console.log(singleAxisData);
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
              // datasets: updDatasets,
            };
            console.log(newChartData);
            setChartData(newChartData);
          });
        } else {
          console.log("нету");
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
          console.log(newChartData);
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
    // }
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
        chosenGraphs={chosenGraphs}
        setChosenGraphs={setChosenGraphs}
      />
      {/* )} */}
      <div className="analysis__graphs">
        {Object.keys(chosenData).map((graph) => {
          console.log(graph, chosenData);
          const typeGraph = axes[graph].chart;
          console.log(chosenData, chartData);
          if (chartData[graph] && chartData[graph].labels.length > 0) {
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
