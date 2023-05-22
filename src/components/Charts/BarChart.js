import { Bar } from "react-chartjs-2";
import { Chart, Legend, Tooltip } from "chart.js";
Chart.register(Legend, Tooltip);
const BarChart = ({ chartData, options }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Диаграмма зависимости</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default BarChart;
