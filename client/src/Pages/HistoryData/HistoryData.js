import { useState, useEffect } from "react";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import { TableCodes } from "../../utils/TableCodes";
import { ChartOptions } from "../../utils/ChartOptions";
import { randColor, sortObj } from "../../utils/utilsFunctions";
import { AllColors } from "../../utils/AllColors";
import "./HistoryData.scss";
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
import cn from "classnames";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);

const historyData = {
  "Количество запущенных спутников по странам за последние 67 лет (более 100 запусков)":
    {
      chart: "barchart",
      main: "state",
      limit: 100,
    },
  "Процентное соотношение запущенных спутников по странам (более 500 запусков)":
    {
      chart: "piechart",
      main: "state",
      limit: 500,
    },
  "Общее количество запусков по годам": {
    chart: "linechart",
    main: "ldateyear",
  },
  "Количество запусков спутников США и России по годам": {
    chart: "linechart",
    main: "ldateyear",
    secondary: "state",
    values: ["US", "RU", "SU"],
    colors: {
      US: "rgb(0, 0, 255)",
      RU: "rgb(246, 217, 221",
    },
  },
  "Распределение всех запущенных спутников по статусам (более 100 запусков)": {
    chart: "barchart",
    main: "status",
    limit: 100,
  },
  "Распределение спутников по типу орбиты (более 200 запусков)": {
    chart: "barchart",
    main: "oporbitoqu",
    limit: 200,
  },
};

export default function HistoryData() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(0);

  // собираем данные по выбранным чекбоксам в базе
  const collectData = async () => {
    const newChartData = Object.assign({}, chartData);
    let promises = Object.keys(historyData).map((chartElement) => {
      return new Promise((resolve, reject) => {
        const data = {};
        if (!historyData[chartElement].values) {
          resolve(
            PickDataDB(historyData[chartElement].main, "")
              .then((allLabels) => {
                const allValues = Object.keys(allLabels).map((label) => {
                  return PickDataDB(historyData[chartElement].main, label).then(
                    (value) => {
                      data[label] = value;
                    }
                  );
                });
                return Promise.all(allValues).then(() => {
                  return data;
                });
              })
              .then((pickedDataRaw) => {
                pickedDataRaw = Object.entries(pickedDataRaw).reduce(
                  (acc, pair) => {
                    if (pair[0] === "SU" || pair[0] === "RU") {
                      if (acc["RU"] === undefined)
                        acc["RU"] = Number(pair[1][pair[0]]);
                      else acc["RU"] += Number(pair[1][pair[0]]);
                      return acc;
                    }
                    if (
                      historyData[chartElement].limit &&
                      pair[1][pair[0]] < historyData[chartElement].limit
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
                if (historyData[chartElement].chart !== "linechart") {
                  Object.keys(pickedData).forEach((key) => {
                    if (
                      AllColors[historyData[chartElement].main] &&
                      AllColors[historyData[chartElement].main][key]
                    )
                      chartColors[key] =
                        AllColors[historyData[chartElement].main][key];
                    else {
                      let bgColor = randColor();
                      AllColors[historyData[chartElement].main][key] = bgColor;
                      chartColors[key] = bgColor;
                    }
                  });
                }

                const bgColors =
                  Object.keys(chartColors).length > 0
                    ? Object.values(chartColors)
                    : chartLineColor;

                const localChartData = { [chartElement]: {} };
                localChartData[chartElement].labels = Object.keys(
                  pickedData
                ).map((key) => {
                  if (
                    TableCodes[historyData[chartElement].main] &&
                    TableCodes[historyData[chartElement].main][key]
                  )
                    return TableCodes[historyData[chartElement].main][key];
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
                return localChartData;
              })
          );
        } else {
          const finalData = {};
          resolve(
            PickDataDB(historyData[chartElement].main, "").then((allData) => {
              const years = Object.keys(allData);
              const localChartData = { [chartElement]: {} };
              historyData[chartElement].values.forEach((country) => {
                if (country !== "SU") finalData[country] = {};
                const countedData = years.map((year) => {
                  if (year.length === 4)
                    return PickDataDB(
                      [
                        historyData[chartElement].main,
                        historyData[chartElement].secondary,
                      ],
                      [year, country]
                    ).then((data) => {
                      if (country === "SU") {
                        const updAmount =
                          Number(Object.values(data)[0]) +
                          Number(Object.values(finalData["RU"][year])[0]);
                        finalData["RU"][year][`${year},RU`] = String(updAmount);
                      } else finalData[country][year] = data;
                    });
                });
                Promise.all(countedData).then(() => {
                  const labels = [];
                  let firstIteration = true;
                  const newDatasets = Object.entries(finalData).map(
                    ([key, value]) => {
                      const mappedAmountByCountry = Object.entries(value).map(
                        ([year, countryObj]) => {
                          if (firstIteration) labels.push(year);
                          return Object.values(countryObj)[0];
                        }
                      );
                      firstIteration = false;
                      return {
                        label:
                          TableCodes[historyData[chartElement].secondary][key],
                        data: mappedAmountByCountry,
                        backgroundColor: historyData[chartElement].colors[key],
                      };
                    }
                  );
                  localChartData[chartElement].datasets = newDatasets;
                  localChartData[chartElement].labels = labels;
                  localChartData[chartElement].loaded = true;
                  return localChartData;
                });
              });
              return localChartData;
            })
          );
        }
      });
    });
    return Promise.all(promises).then((chartDataElements) => {
      chartDataElements.map((chartDataElement) => {
        return (newChartData[Object.keys(chartDataElement)[0]] =
          Object.values(chartDataElement)[0]);
      });
      return newChartData;
    });
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    collectData()
      .then((data) => {
        setChartData(data);
      })
      .then(() => setLoading(true));
  }, []);

  if (!loading) return <p>Загрузка...</p>;

  return (
    <div className="history__wrapper">
      <h1 className="history__title">Самостоятельный анализ данных</h1>
      <div className="history__graphs">
        {Object.keys(historyData).map((graph, num) => {
          const typeGraph = historyData[graph].chart;
          if (
            chartData[graph] &&
            chartData[graph].labels &&
            chartData[graph].labels.length > 0
          ) {
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
                    options={ChartOptions().optionsPie}
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
                    options={ChartOptions().optionsBar}
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
                    options={ChartOptions().optionsLine}
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
