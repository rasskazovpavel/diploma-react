import { useState, useEffect } from "react";
// import { Data } from "./utils/Data";
import { PickData } from "./utils/PickData";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import FiltersMenu from "./components/FiltersMenu";
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
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);

export default function App() {
  const [chosenData, setChosenData] = useState([]);
  const [currFilter, setCurrFilter] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  // let [keys, values] = [];
  // if (chosenData) [keys, values] = PickData("UNState", chosenData[1]);
  // console.log(chosenData);
  // console.log(keys, values);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Количество запусков ",
        data: values,
        backgroundColor: ["rgba(75,192,192,1)"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  // const [chartData, setChartData] = useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: "Количество запусков ",
  //       data: values,
  //       backgroundColor: ["rgba(75,192,192,1)"],
  //       borderColor: "black",
  //       borderWidth: 2,
  //     },
  //   ],
  // });

  console.log(chartData);

  const collectChosenData = async (data) => {
    console.log(currFilter);
    let [keys, nums] = PickData(currFilter, chosenData);
    console.log(keys, values);
    setLabels(keys);
    setValues(nums);
    console.log(labels);
    console.log(typeof values[0]);
  };

  const updateChartData = async (keys, values) => {
    // console.log(keys, values);
    // let updChartData = chartData;
    // updChartData.labels = [...keys];
    // updChartData.datasets[0].data = [...values];
    // setChartData(updChartData);
  };

  useEffect(() => {
    collectChosenData();
  }, [chosenData]);

  return (
    <div className="App">
      <FiltersMenu
        chosenData={chosenData}
        setChosenData={setChosenData}
        setCurrFilter={setCurrFilter}
      />
      <p>
        <button
          id="btn"
          className="btn btn-sm btn-outline-primary"
          onClick={() => updateChartData(labels, values)}
        >
          Применить
        </button>
      </p>
      <div className="main">
        {/* <PieChart chartData={chartData} /> */}
        <BarChart chartData={chartData} />
        {/* <LineChart chartData={chartData} /> */}
      </div>
    </div>
  );
}
