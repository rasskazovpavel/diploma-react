import { useState, useEffect, useMemo } from "react";
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
import { CountryCodes } from "../../utils/CountryCodes";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);

const optionsPie = {
  tooltips: {
    enabled: false,
  },
  plugins: {
    legend: {
      labels: {
        color: "#3C4D5F",
      },
    },
    datalabels: {
      formatter: (val, context) =>
        `${
          (Number(val) * 100) /
          context.chart.data.datasets[context.datasetIndex].data.reduce(
            (a, b) => Number(a) + Number(b),
            0
          )
        }%`,
      color: "#fff",
    },
    tooltip: {
      callbacks: {
        label: (item) =>
          `${item.label}: ${(
            (item.parsed * 100) /
            item.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)
          ).toFixed(2)}%`,
      },
    },
  },
};
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
const optionsLine = {
  plugins: {
    legend: {
      labels: {
        color: "#3C4D5F",
      },
    },
  },
  scales: {
    x: {
      border: {
        color: "#3C4D5F",
      },
      ticks: {
        color: "#3C4D5F",
      },
    },
    y: {
      border: {
        color: "#3C4D5F",
      },
      ticks: {
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

const sortObj = (obj) => {
  const keys = Object.keys(obj);
  keys.sort();
  const sortedObj = {};
  const sortedObjLength = keys.length;
  for (let i = 0; i < sortedObjLength; i++) {
    let k = keys[i];
    sortedObj[k] = obj[k];
  }
  return sortedObj;
};

const reviewData = {
  "Распределение спутников на орбите по странам": {
    chart: "barchart",
    main: "state",
    limit: 100,
  },
  "Процентное соотношение запущенных находящихся на орбите спутников по странам (более 1000 запусков)":
    {
      chart: "piechart",
      main: "state",
      limit: 1000,
    },
};

let allColors = {
  RU: "rgb(246, 217, 221",
  CN: "rgb(255, 0, 0)",
  US: "rgb(0, 0, 255)",
  IN: "rgb(167, 127, 14)",
  J: "rgb(222, 49, 49)",
  F: "rgb(139, 0, 255)",
  UK: "rgb(128, 128, 128)",
  Другое: "rgb(0, 255, 0)",
};

export default function CurrentSituation() {
  // данные для графиков (ключи и значения)
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  // собираем данные по выбранным чекбоксам в базе
  const collectData = async () => {
    const newChartData = Object.assign({}, chartData);
    for await (let chartElement of Object.keys(reviewData)) {
      const data = {};
      const pickedData = PickDataDB(reviewData[chartElement].main, "", "orbit")
        .then((allLabels) => {
          console.log(allLabels);
          const allValues = Object.keys(allLabels).map((label) => {
            return PickDataDB(
              reviewData[chartElement].main,
              label,
              "orbit"
            ).then((value) => {
              data[label] = value;
            });
          });
          return Promise.all(allValues).then((allValues) => {
            return data;
          });
        })
        // eslint-disable-next-line no-loop-func
        .then((pickedDataRaw) => {
          console.log(pickedDataRaw);
          pickedDataRaw = Object.entries(pickedDataRaw).reduce((acc, pair) => {
            if (pair[0] === "SU" || pair[0] === "RU") {
              console.log(pair[1][pair[0]], pair[0]);
              if (acc["RU"] === undefined) acc["RU"] = Number(pair[1][pair[0]]);
              else acc["RU"] += Number(pair[1][pair[0]]);
              return acc;
            }
            if (
              reviewData[chartElement].limit &&
              pair[1][pair[0]] < reviewData[chartElement].limit
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

          const pickedData = sortObj(pickedDataRaw);

          const values = Object.values(pickedData);

          const chartColors = {};
          const chartLineColor = "#3c4d5f";
          if (reviewData[chartElement].chart !== "linechart") {
            Object.keys(pickedData).forEach((key) => {
              if (allColors[key]) chartColors[key] = allColors[key];
              else {
                let bgColor = randColor();
                allColors[key] = bgColor;
                chartColors[key] = bgColor;
              }
            });
          }

          const bgColors =
            Object.keys(chartColors).length > 0
              ? Object.values(chartColors)
              : chartLineColor;

          newChartData[chartElement] = {};
          console.log(Object.keys(pickedData));
          newChartData[chartElement].labels = Object.keys(pickedData).map(
            (key) => {
              if (CountryCodes[key]) return CountryCodes[key];
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
          console.log(newChartData);
          return newChartData;
        })
        .then((newChartData) => {
          console.log(newChartData);
          setChartData(newChartData);
          if (
            Object.keys(reviewData).length - 1 ===
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
      <h1 className="current_situation__title">
        Текущая ситуация
      </h1>
      <div className="current_situation__graphs">
        {Object.keys(reviewData).map((graph) => {
          const typeGraph = reviewData[graph].chart;
          if (chartData[graph] && chartData[graph].labels.length > 0) {
            if (typeGraph === "piechart")
              return (
                <div className="graph__container piechart__container">
                  <PieChart
                    chartData={chartData[graph]}
                    options={optionsPie}
                    key={graph}
                    title={graph}
                  />
                </div>
              );
            if (typeGraph === "barchart")
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
                    options={optionsLine}
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
