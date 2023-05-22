const FiltersTypeGraph = ({
  setTypeGraph,
  setAxes,
  setChosenData,
  setChartData,
}) => {
  const handleType = (e) => {
    setTypeGraph(e.target.value);
    setAxes({ x: "", y: "" });
    setChosenData({});
    setChartData({ labels: [], datasets: [] });
  };
  return (
    <div className="filters__type_graph">
      <p>Выберите тип графика</p>
      <div className="filters__type_bar">
        <input type="radio" name="type" value="barchart" onClick={handleType} />{" "}
        Столбчатая диаграмма
      </div>
      <div className="filters__type_pie">
        <input type="radio" name="type" value="piechart" onClick={handleType} />{" "}
        Круговая диаграмма
      </div>
      <div className="filters__type_line">
        <input
          type="radio"
          name="type"
          value="linechart"
          onClick={handleType}
        />{" "}
        График
      </div>
    </div>
  );
};

export default FiltersTypeGraph;
