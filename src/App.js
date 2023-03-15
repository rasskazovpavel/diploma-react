import { useState, useEffect, useMemo } from "react";
// import { Data } from "./utils/Data";
import { PickData } from "./utils/PickData";
import PieChart from "./components/Charts/PieChart";
import BarChart from "./components/Charts/BarChart";
import LineChart from "./components/Charts/LineChart";
import FiltersMenu from "./components/FiltersMenu";
// import * as SATS from "./utils/data.json";
// import "./styles.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { PrepareData } from "./utils/PrepareData";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);

// переводим численные высоты в GEO, MEO, LEO
// const idToParse = ["UNApogee"];
// const SATSParsed = PrepareData(SATS, idToParse);

export default function App() {
  const [chosenData, setChosenData] = useState({}); // выбранные чекбоксы
  const [currFilter, setCurrFilter] = useState([]); // текущий фильтр (назначение, страна, высота)

  // текущие главная ось (абсцисса) и побочная (ордината)
  const [axes, setAxes] = useState({
    x: "",
    y: "",
  });

  const [allData, setAllData] = useState(); // данные из БД

  const [colors, setColors] = useState({});

  // параметры для графиков (позволяют делать слоёные графики)
  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // данные для графиков (ключи и значения)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const randColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
        const sortedData = Object.entries(pickedData).sort((a, b) => {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        });
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
            borderColor: "black",
            borderWidth: 2,
          },
        ];
      });
    const newChartData = Object.assign({}, chartData);
    newChartData.labels = keys;
    newChartData.datasets = updatedDatasets;
    setChartData(newChartData);
  };

  // собираем данные по выбранным чекбоксам в базе
  const collectChosenData = async () => {
    // если выбрали чекбокс главной оси
    if (currFilter === axes.x) {
      if (chosenData[axes.y]) handleStackedGraphs();
      else {
        const singleAxisData = PickData(allData, axes.x, chosenData);
        let bgColor;
        if (colors[axes.x]) bgColor = colors[axes.x];
        else {
          bgColor = randColor();
          setColors({ ...colors, [axes.x]: bgColor });
        }
        setChartData({
          labels: Object.keys(singleAxisData),
          datasets: [
            {
              label: "Количество запусков",
              data: Object.values(singleAxisData),
              backgroundColor: bgColor,
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        });
      }
    }
    // если выбрали чекбокс побочной оси
    if (currFilter === axes.y) {
      handleStackedGraphs();
    }
  };

  function getDataFromDB() {
    fetch("http://localhost:3001")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const dataToParse = JSON.parse(data).rows.map((row) => {
          row.date_launch = row.date_launch.split("-")[0];
          return row;
        });
        setAllData(dataToParse);
      });
  }

  // вызываем сбор данных в конце
  useEffect(() => {
    // console.log(chosenData);
    collectChosenData();
  }, [chosenData, axes]);

  useEffect(() => {
    getDataFromDB();
  }, []);

  return (
    <div className="App">
      {allData && (
        <FiltersMenu
          setChosenData={setChosenData}
          chosenData={chosenData}
          setCurrFilter={setCurrFilter}
          currFilter={currFilter}
          allData={allData}
          axes={axes}
          setAxes={setAxes}
        />
      )}
      <div className="main">
        {/* <PieChart chartData={chartData} /> */}
        <BarChart chartData={chartData} options={options} />
        {/* <LineChart chartData={chartData} /> */}
      </div>
    </div>
  );
}
