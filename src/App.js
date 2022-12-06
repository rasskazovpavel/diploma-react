import { useState } from "react";
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
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(PointElement);
Chart.register(LineElement);

export default function App() {
  const [keys, values] = PickData("UNState", 20);
  console.log(keys, values);
  const [chartData, setChartData] = useState({
    labels: keys,
    datasets: [
      {
        label: "Количество запусков ",
        data: values,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="App">
      <FiltersMenu />
      <div className="main">
        {/* <PieChart chartData={chartData} /> */}
        <BarChart chartData={chartData} />
        {/* <LineChart chartData={chartData} /> */}
      </div>
    </div>
  );
}
