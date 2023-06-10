import { useState, useEffect, useMemo } from "react";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import { CountryCodes } from "../../utils/CountryCodes";
import "./Review.scss";
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
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);

// переводим численные высоты в GEO, MEO, LEO
// параметры для графиков (позволяют делать слоёные графики)
const optionsPie = {
  plugins: {
    legend: {
      labels: {
        color: "#3C4D5F",
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
  "Количество запущенных спутников по странам за последние 67 лет": {
    chart: "barchart",
    main: "state",
    limit: 100,
  },
  "Процентное соотношение запущенных спутников по странам (более 700 запусков)":
    {
      chart: "piechart",
      main: "state",
      limit: 1000,
    },
  "Общее количество запусков по годам": {
    chart: "linechart",
    main: "ldateyear",
  },
  "Количество запусков спутников США и России по годам": {
    chart: "linechart",
    main: "ldateyear",
    secondary: "state",
    values: ["US", "RU"],
    colors: {
      US: "rgb(0, 0, 255)",
      RU: "rgb(246, 217, 221",
    },
  },
  "Распределение всех запущенных спутников по статусам": {
    chart: "barchart",
    main: "status",
  },
  "Статус спутников по странам (более 700 запусков)": {
    chart: "barchart",
    main: "state",
    // secondary: "status",
    limit: 700,
  },
  "Количество спутников, находящихся на орбите и выведенных с орбиты по странам":
    {
      chart: "barchart",
      main: "state",
      // secondary: "ddate",
    },
  "Распределение спутников по типу орбиты (более 100 запусков)": {
    chart: "barchart",
    main: "oporbitoqu",
    limit: 100,
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

export default function Review() {
  const [colors, setColors] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(0);
  const [loadingComplex, setLoadingComplex] = useState(false);

  const simpleGraphs = Object.keys(reviewData).reduce((acc, chart) => {
    if (!reviewData[chart].secondary) acc.push(chart);
    return acc;
  }, []);

  const complexGraphs = Object.keys(reviewData).reduce((acc, chart) => {
    if (reviewData[chart].secondary) acc.push(chart);
    return acc;
  }, []);

  // собираем данные по выбранным чекбоксам в базе
  const collectData = async () => {
    const newChartData = Object.assign({}, chartData);
    // for (let chartElement of Object.keys(reviewData)) {
    let promises = Object.keys(reviewData).map((chartElement) => {
      return new Promise((resolve, reject) => {
        const data = {};
        if (!reviewData[chartElement].values) {
          resolve(
            PickDataDB(reviewData[chartElement].main, "")
              .then((allLabels) => {
                console.log("here");
                const allValues = Object.keys(allLabels).map((label) => {
                  if (label.length === 4)
                    return PickDataDB(
                      reviewData[chartElement].main,
                      label
                    ).then((value) => {
                      data[label] = value;
                    });
                });
                return Promise.all(allValues).then((allValues) => {
                  return data;
                });
              })
              .then((pickedDataRaw) => {
                pickedDataRaw = Object.entries(pickedDataRaw).reduce(
                  (acc, pair) => {
                    if (pair[0] === "SU" || pair[0] === "RU") {
                      console.log(pair[1][pair[0]], pair[0]);
                      if (acc["RU"] === undefined)
                        acc["RU"] = Number(pair[1][pair[0]]);
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
                    } else {
                      acc[pair[0]] = pair[1][pair[0]];
                    }
                    return acc;
                  },
                  {}
                );
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

                const localChartData = { [chartElement]: {} };
                console.log(Object.keys(pickedData));
                localChartData[chartElement].labels = Object.keys(
                  pickedData
                ).map((key) => {
                  if (CountryCodes[key]) return CountryCodes[key];
                  return key;
                });
                localChartData[chartElement].datasets = [
                  {
                    label: "Количество спутников",
                    data: values,
                    backgroundColor: bgColors,
                    fill: true,
                    borderWidth: 2,
                  },
                ];
                localChartData[chartElement].loaded = true;
                console.log(localChartData);
                return localChartData;
              })
          );
        } else {
          const finalData = {};
          console.log("куку");
          let count = 0;
          resolve(
            PickDataDB(reviewData[chartElement].main, "").then((allData) => {
              console.log(allData);
              const years = Object.keys(allData);
              // for await (let country of reviewData[chartElement].values) {
              const localChartData = { [chartElement]: {} };
              reviewData[chartElement].values.forEach((country) => {
                finalData[country] = {};
                const countedData = years.map((year) => {
                  if (year.length === 4)
                    return PickDataDB(
                      [
                        reviewData[chartElement].main,
                        reviewData[chartElement].secondary,
                      ],
                      [year, country]
                    ).then((data) => {
                      // console.log(data);
                      finalData[country][year] = data;
                      if (country === "RU") {
                        return PickDataDB(
                          [
                            reviewData[chartElement].main,
                            reviewData[chartElement].secondary,
                          ],
                          [year, "SU"]
                        ).then((data) => {
                          const updAmount =
                            Number(Object.values(data)[0]) +
                            Number(Object.values(finalData[country][year])[0]);
                          finalData[country][year][`${year},${country}`] =
                            String(updAmount);
                          // console.log(finalData[country][year]);
                        });
                      }
                    });
                  else {
                    console.log(year);
                  }
                });
                Promise.all(countedData).then((data) => {
                  console.log(finalData, Object.entries(finalData));
                  // const localChartData = {[chartElement]: {}}
                  // newChartData[chartElement] = {};
                  const labels = [];
                  let firstIteration = true;
                  const newDatasets = Object.entries(finalData).map(
                    ([key, value]) => {
                      console.log(value);
                      const mappedAmountByCountry = Object.entries(value).map(
                        ([year, countryObj]) => {
                          if (firstIteration) labels.push(year);
                          return Object.values(countryObj)[0];
                        }
                      );
                      firstIteration = false;
                      return {
                        label: key,
                        data: mappedAmountByCountry,
                        backgroundColor: reviewData[chartElement].colors[key],
                      };
                    }
                  );
                  localChartData[chartElement].datasets = newDatasets;
                  localChartData[chartElement].labels = labels;
                  localChartData[chartElement].loaded = true;
                  return localChartData;
                });
              });
              // }
              console.log(localChartData);
              // newChartData[chartData] = localChartData;
              console.log(localChartData);
              return localChartData;
            })
          );
        }
      });
    });
    return Promise.all(promises).then((chartDataElements) => {
      console.log(chartDataElements);
      chartDataElements.map((chartDataElement) => {
        return (newChartData[Object.keys(chartDataElement)[0]] =
          Object.values(chartDataElement)[0]);
      });
      console.log(newChartData);
      return newChartData;
    });
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    collectData().then((data) => {
      setChartData(data, () => setLoading(true));
      setLoading(true);
      console.log(data);
    });
  }, []);

  // if (
  //   Object.keys(chartData).every((graph) => {
  //     console.log(chartData[graph]);
  //     return chartData[graph] && chartData[graph].loaded;
  //   })
  // )
  //   setLoading(true);

  if (!loading) return <p>Загрузка...</p>;

  return (
    <div className="review__wrapper">
      <h1 className="review__title">Самостоятельный анализ данных</h1>
      <div className="review__graphs">
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
