import { useState, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PickData } from "../../utils/PickData";
import PieChart from "../../components/Charts/PieChart";
import BarChart from "../../components/Charts/BarChart";
import LineChart from "../../components/Charts/LineChart";
import FiltersMenu from "../../components/FiltersMenu";
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

const reviewData = {
  "Количество запущенных спутников по странам за последние 67 лет": {
    chart: "barchart",
    main: "country_op",
    limit: 100,
  },
  "Процентное соотношение запущенных спутников по странам (более 700 запусков)":
    {
      chart: "piechart",
      main: "country_op",
      limit: 700,
    },
  "Процентное соотношение запущенных спутников по странам (более 1000 запусков)":
    {
      chart: "piechart",
      main: "country_op",
      limit: 1000,
    },
  "Общее количество запусков по годам": {
    chart: "linechart",
    main: "date_launch",
  },
  "Количество запусков спутников США и России по годам": {
    chart: "linechart",
    main: "date_launch",
    secondary: "country_op",
    values: ["US", "CIS"],
    colors: {
      US: "blue",
      CIS: "red",
    },
  },
};

export default function Review() {
  const [colors, setColors] = useState({});
  // данные для графиков (ключи и значения)
  const [chartData, setChartData] = useState({});

  // собираем данные по выбранным чекбоксам в базе
  const collectData = async () => {
    const newChartData = Object.assign({}, chartData);
    Object.keys(reviewData).forEach((chartElement) => {
      const data = {};
      if (!reviewData[chartElement].values) {
        const pickedData = PickDataDB(reviewData[chartElement].main, "").then(
          (allLabels) => {
            console.log("here");
            const allValues = Object.keys(allLabels).map((label) => {
              return PickDataDB(reviewData[chartElement].main, label).then(
                (value) => {
                  data[label] = value;
                }
              );
            });
            return Promise.all(allValues).then((allValues) => {
              // console.log(data);
              // console.log(Object.keys(data));
              return data;
            });
          }
        );
        pickedData.then((pickedData) => {
          pickedData = Object.entries(pickedData).reduce((acc, pair) => {
            if (
              reviewData[chartElement].limit &&
              pair[1][pair[0]] < reviewData[chartElement].limit
            ) {
              // console.log(typeof Number(pair[1][pair[0]]));
              if (acc["Другое"] !== undefined)
                acc["Другое"] += Number(pair[1][pair[0]]);
              else acc["Другое"] = 0;
            } else {
              acc[pair[0]] = pair[1][pair[0]];
            }
            return acc;
          }, {});
          // }
          const values = Object.values(pickedData);

          const chartColors = {};
          const chartLineColor = "#3c4d5f";
          if (reviewData[chartElement].chart !== "linechart") {
            Object.keys(pickedData).forEach((key) => {
              if (colors[key]) chartColors[key] = colors[key];
              else {
                let bgColor = randColor();
                // console.log(bgColor);
                let newColors = { ...colors, [key]: bgColor };
                setColors(newColors);
                chartColors[key] = bgColor;
              }
            });
            // console.log(chartColors);
          }

          const bgColors =
            Object.keys(chartColors).length > 0
              ? Object.values(chartColors)
              : chartLineColor;

          newChartData[chartElement] = {};
          newChartData[chartElement].labels = Object.keys(pickedData);
          newChartData[chartElement].datasets = [
            {
              label: chartElement,
              data: values,
              backgroundColor: bgColors,
              fill: true,
              borderWidth: 2,
            },
          ];
          // console.log(newChartData);
          setChartData(newChartData);
        });
      } else {
        const finalData = {};
        const properYears = PickDataDB(reviewData[chartElement].main, "").then(
          (allData) => {
            const years = Object.keys(allData);
            reviewData[chartElement].values.forEach((country) => {
              finalData[country] = {};
              const countedData = years.map((year) => {
                return PickDataDB(
                  [
                    reviewData[chartElement].main,
                    reviewData[chartElement].secondary,
                  ],
                  [year, country]
                ).then((data) => {
                  finalData[country][year] = data;
                });
              });
              return Promise.all(countedData).then((data) => {
                console.log(finalData, Object.entries(finalData));
                newChartData[chartElement] = {};
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
                newChartData[chartElement].datasets = newDatasets;
                newChartData[chartElement].labels = labels;
                console.log(newChartData);
                setChartData(newChartData);
                // newChartData[chartElement].datasets = newDatasets;
              });
            });
          }
        );
      }
    });
  };

  const div2PDF = (e) => {
    // const but = e.target;
    // but.style.display = "none";
    // let inputs = window.document.getElementsByClassName("chart-container");
    // let arr = [].slice.call(inputs);
    // console.log(inputs);
    // arr.forEach((input) => {
    //   console.log(input);
    // });
    // let container =
    //   window.document.getElementsByClassName("content__wrapper")[0];
    // arr.forEach((input) => {
    // html2canvas(input).then((canvas) => {
    //   const pdf = new jsPDF("l", "pt");
    //   const img = canvas.toDataURL("image/png");
    //   // pdf.setFillColor(0, 0, 0, 1);
    //   // pdf.rect(10, 10, 150, 160, "F");
    //   pdf.addImage(
    //     img,
    //     "png",
    //     input.offsetLeft - container.offsetLeft,
    //     input.offsetTop - container.offsetTop,
    //     input.style.width,
    //     input.style.height
    //   );
    //   but.style.display = "block";
    //   pdf.save("chart.pdf");
    // });
    // });
    // console.log(arr);
    // const tasks = arr.map((tab) => html2canvas(tab));
    // console.log(tasks);
    // const pdf = new jsPDF();
    // const width = pdf.internal.pageSize.getWidth();
    // const height = pdf.internal.pageSize.getHeight();
    // Promise.all(tasks).then((canvases) => {
    //   for (const canvas of canvases) {
    //     const imgData = canvas.toDataURL("image/png");
    //     pdf.addImage(imgData, "JPEG", 0, 0, width, height);
    //     pdf.addPage();
    //   }
    //   pdf.save("Download.pdf");
    // });
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    collectData();
  }, []);

  return (
    <div className="review__wrapper">
      <h1 className="review__title">Самостоятельный анализ данных</h1>
      <button className="pdf__button" onClick={(e) => div2PDF(e)}>
        Экспортировать в PDF
      </button>
      {/* )} */}
      <div className="review__graphs">
        {Object.keys(reviewData).map((graph) => {
          const typeGraph = reviewData[graph].chart;
          // console.log(Object.keys(reviewData));
          if (chartData[graph] && chartData[graph].labels.length > 0) {
            // console.log(typeGraph, chartData, graph);
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
