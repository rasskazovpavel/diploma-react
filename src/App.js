import { useState, useEffect } from "react";
// import { Data } from "./utils/Data";
import { PickData } from "./utils/PickData";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import FiltersMenu from "./components/FiltersMenu";
import * as SATS from "./utils/data.json";
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
const idToParse = ["UNApogee"];
const SATSParsed = PrepareData(SATS, idToParse);
console.log(SATSParsed);

export default function App() {
  const [chosenData, setChosenData] = useState([]); // выбранные чекбоксы
  const [currFilter, setCurrFilter] = useState([]); // текущий фильтр (назначение, страна, высота)
  const [labels, setLabels] = useState([]); // выбранные ключи
  const [values, setValues] = useState([]); // выбранные значения

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

  // собираем данные по выбранным чекбоксам в базе
  const collectChosenData = async () => {
    let [keys, nums] = PickData(SATSParsed, currFilter, chosenData);
    setLabels(keys);
    setValues(nums);
  };

  // вызываем сбор данных в конце
  useEffect(() => {
    console.log(chosenData);
    collectChosenData();
  }, [chosenData]);

  return (
    <div className="App">
      <FiltersMenu
        setChosenData={setChosenData}
        setCurrFilter={setCurrFilter}
        currFilter={currFilter}
        SATS={SATSParsed}
      />
      <div className="main">
        {/* <PieChart chartData={chartData} /> */}
        <BarChart chartData={chartData} />
        {/* <LineChart chartData={chartData} /> */}
      </div>
    </div>
  );
}
