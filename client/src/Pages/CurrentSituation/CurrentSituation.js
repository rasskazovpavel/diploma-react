import { useState, useEffect } from "react";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import "./CurrentSituation.scss";
import "../../App.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { PickDataDB } from "../../utils/PickDataDB";
import { TableCodes } from "../../utils/TableCodes";
import { ChartOptions } from "../../utils/ChartOptions";
import { randColor, sortObj } from "../../utils/utilsFunctions";
import { AllColors } from "../../utils/AllColors";
import cn from "classnames";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);

const currentData = {
  "Распределение спутников на орбите по странам (более 100 запусков)": {
    chart: "barchart",
    main: "state",
    limit: 100,
  },
  "Процентное соотношение спутников на орбите по странам (более 500 запусков)":
    {
      chart: "piechart",
      main: "state",
      limit: 500,
    },
  "Распределение спутников на орбите по типу орбиты (более 100 запусков)": {
    chart: "barchart",
    main: "oporbitoqu",
    limit: 100,
  },
};

export default function CurrentSituation() {
  // данные для графиков (ключи и значения)
  const [chartData, setChartData] = useState({});
  // состояние указывает, подтянулись ли данные или нет
  const [loading, setLoading] = useState(true);

  // собираем данные
  const collectData = async () => {
    const newChartData = Object.assign({}, chartData);
    for await (let chartElement of Object.keys(currentData)) {
      // будем собирать данные по графику сюда
      const data = {};
      // достаём все значения по категории
      PickDataDB(currentData[chartElement].main, "", "")
        .then((allLabels) => {
          const allValues = Object.keys(allLabels).map((label) => {
            // достаём те, у которых нет DDate
            return PickDataDB(
              currentData[chartElement].main,
              label,
              "orbit"
            ).then((value) => {
              data[label] = value;
            });
          });
          return Promise.all(allValues).then(() => {
            return data;
          });
        })
        .then((pickedDataRaw) => {
          pickedDataRaw = Object.entries(pickedDataRaw).reduce((acc, pair) => {
            // обрабатываем Россию и СССР
            if (pair[0] === "SU" || pair[0] === "RU") {
              if (acc["RU"] === undefined) acc["RU"] = Number(pair[1][pair[0]]);
              else acc["RU"] += Number(pair[1][pair[0]]);
              return acc;
            }
            // обрабатываем предельные значения, добавляем всё маленькое в "Другое"
            if (
              currentData[chartElement].limit &&
              pair[1][pair[0]] < currentData[chartElement].limit
            ) {
              if (acc["Другое"] !== undefined)
                acc["Другое"] += Number(pair[1][pair[0]]);
              else acc["Другое"] = 0;
              return acc;
            } else {
              acc[pair[0]] = pair[1][pair[0]];
              return acc;
            }
          }, {});
          pickedDataRaw["Другое"] = String(pickedDataRaw["Другое"]);

          // сортируем всё по алфавиту
          const pickedData = sortObj(pickedDataRaw);

          const values = Object.values(pickedData);

          const chartColors = {};
          const chartLineColor = "#3c4d5f";
          if (currentData[chartElement].chart !== "linechart") {
            Object.keys(pickedData).forEach((key) => {
              // если есть цвет, берём его
              if (
                AllColors[currentData[chartElement].main] &&
                AllColors[currentData[chartElement].main][key]
              )
                chartColors[key] =
                  AllColors[currentData[chartElement].main][key];
              else {
                // если нет, создаём новый
                let bgColor = randColor();
                AllColors[currentData[chartElement].main][key] = bgColor;
                chartColors[key] = bgColor;
              }
            });
          }

          const bgColors =
            Object.keys(chartColors).length > 0
              ? Object.values(chartColors)
              : chartLineColor;

          newChartData[chartElement] = {};
          console.log();
          // если элемент есть в TableCodes, подставляем название
          newChartData[chartElement].labels = Object.keys(pickedData).map(
            (key) => {
              if (TableCodes[currentData[chartElement].main][key])
                return TableCodes[currentData[chartElement].main][key];
              return key;
            }
          );
          newChartData[chartElement].datasets = [
            {
              label: "Количество спутников",
              data: values,
              backgroundColor: bgColors,
              fill: true,
              borderWidth: 2,
            },
          ];
          return newChartData;
        })
        .then((newChartData) => {
          setChartData(newChartData);
          if (
            Object.keys(currentData).length - 1 ===
            Object.keys(newChartData).length - 1
          )
            setLoading(false);
        });
    }
  };

  useEffect(() => {
    collectData();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  return (
    <div className="current_situation__wrapper">
      <h1 className="current_situation__title">Текущая ситуация</h1>
      <div className="current_situation__graphs">
        {Object.keys(currentData).map((graph, num) => {
          const typeGraph = currentData[graph].chart;
          if (chartData[graph] && chartData[graph].labels.length > 0) {
            if (typeGraph === "piechart")
              return (
                <div
                  className={cn(
                    "graph__container",
                    "piechart__container",
                    `piechart__container_${num}`
                  )}
                >
                  <PieChart
                    chartData={chartData[graph]}
                    options={ChartOptions.optionsPie}
                    key={graph}
                    title={graph}
                  />
                </div>
              );
            if (typeGraph === "barchart")
              return (
                <div
                  className={cn(
                    "graph__container",
                    "barchart__container",
                    `barchart__container_${num}`
                  )}
                >
                  <BarChart
                    chartData={chartData[graph]}
                    options={ChartOptions.optionsBar}
                    key={graph}
                    title={graph}
                  />
                </div>
              );
            if (typeGraph === "linechart")
              return (
                <div
                  className={cn(
                    "graph__container",
                    "linechart__container",
                    `linechart__container${num}`
                  )}
                >
                  <LineChart
                    chartData={chartData[graph]}
                    options={ChartOptions.optionsLine}
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
