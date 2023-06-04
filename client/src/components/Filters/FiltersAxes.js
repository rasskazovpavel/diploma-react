import { useState } from "react";
import { filtersData } from "../../utils/FiltersData";

const FiltersAxes = ({ axes, setAxes, typeGraph }) => {
  const handleMain = (e) => {
    const newAxes = Object.assign({}, axes);
    newAxes.x = e.target.value;
    setAxes(newAxes);
  };

  const handleSecondary = (e) => {
    const newAxes = Object.assign({}, axes);
    newAxes.y = e.target.value;
    setAxes(newAxes);
  };

  return (
    <div className="filters__axes">
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
      {typeGraph === "barchart" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default FiltersAxes;
