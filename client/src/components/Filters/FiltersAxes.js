import { filtersData } from "../../utils/FiltersData";

const FiltersAxes = ({
  axes,
  setAxes,
  typeGraph,
  setChartData,
  setChosenData,
}) => {
  const handleMain = (e) => {
    const newAxes = {};
    newAxes.x = e.target.value;
    setAxes(newAxes);
    setChosenData({});
    setChartData({ labels: [], datasets: [] });
  };

  const handleSecondary = (e) => {
    const newAxes = Object.assign({}, axes);
    newAxes.y = e.target.value;
    setAxes(newAxes);
  };

  return (
    <div className="filters__axes">
      <div className="filters__axes--main">
        <p>Выберите главную ось</p>
        {filtersData.map((line, i) => {
          return (
            <div key={i}>
              <input
                type="radio"
                name="main"
                value={line.id}
                onClick={handleMain}
                checked={axes.x === line.id}
              />{" "}
              {line.name}
            </div>
          );
        })}
      </div>
      {(typeGraph === "barchart" || typeGraph === "linechart") && (
        <div className="filters__axes--secondary">
          <p>Выберите побочную ось</p>
          {filtersData.map((line, i) => {
            if (line.id !== axes.x)
              return (
                <div key={i}>
                  <input
                    type="radio"
                    name="secondary"
                    value={line.id}
                    onClick={handleSecondary}
                    checked={axes.y === line.id}
                  />{" "}
                  {line.name}
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default FiltersAxes;
