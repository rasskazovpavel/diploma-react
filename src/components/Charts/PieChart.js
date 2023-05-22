import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, options }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Диаграмма зависимости</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
}
export default PieChart;
