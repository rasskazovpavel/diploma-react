import { useState } from "react";
import { filtersData } from "../../utils/FiltersData";

const FiltersAxes = ({ axes, setAxes }) => {
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
            />{" "}
            {line.name}
          </div>
        );
      })}
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
              />{" "}
              {line.name}
            </div>
          );
      })}
    </div>
  );
};

export default FiltersAxes;
