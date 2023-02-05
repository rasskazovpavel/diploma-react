import React, { useState } from "react";
const FiltersCheckBox = ({ filtersDataItem, setChosenData, setCurrFilter }) => {
  // достаём данные из FiltersMenu
  console.log(filtersDataItem);
  const [data, setData] = useState(filtersDataItem.options);
  const [parentChecked, setParentChecked] = useState(false);

  // обновляем выбранные данные
  const updateChosenData = (currData, i) => {
    // обновляем текущий фильтр в App.js
    setCurrFilter(filtersDataItem.id);
    // если все фильтры категории выбраны, то родительский тоже
    if (currData.every((line) => line.isChecked === true)) {
      setParentChecked(true);
    } else setParentChecked(false);
    // собираем в массиы выбранные фильтры
    const selectedData = currData.reduce((acc, line) => {
      if (line.isChecked) {
        acc.push(line.unit);
      }
      return acc;
    }, []);
    let updData = selectedData;
    setChosenData(updData);
  };

  // обновляем фильтры категории
  const changeCheckboxStatus = (i) => {
    const currData = data.map((line, order) =>
      order === i ? { unit: data[i].unit, isChecked: !data[i].isChecked } : line
    );

    updateChosenData(currData);
    setData(currData);
  };

  // обновляем родительский чекбокс
  const changeParentCheckbox = (e) => {
    setParentChecked(e.currentTarget.checked);
    const currData = data.map((line, order) => {
      return { unit: data[order].unit, isChecked: e.currentTarget.checked };
    });
    updateChosenData(currData);
    setData(currData);
  };

  return (
    <ul>
      <li>
        <input
          type="checkbox"
          value="parent"
          onChange={(e) => changeParentCheckbox(e)}
          checked={parentChecked}
        />
        {filtersDataItem.name}
      </li>
      <ul>
        {data.map((line, i) => {
          return (
            <li key={i}>
              <input
                type="checkbox"
                value="child"
                onChange={() => changeCheckboxStatus(i)}
                checked={line.isChecked}
              />
              {line.unit}
            </li>
          );
        })}
      </ul>
    </ul>
  );
};
export default FiltersCheckBox;
