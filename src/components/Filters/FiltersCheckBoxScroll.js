import React, { useEffect, useState } from "react";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
import { PickData } from "../../utils/PickData";

const FiltersCheckBoxScroll = ({
  filtersDataItem,
  setChosenData,
  setCurrFilter,
  chosenData,
  currFilter,
  allData,
}) => {
  // отбираем из таблицы данные по нужной категории
  const [data, setData] = useState(
    Object.keys(PickData(allData, filtersDataItem.id)).map((item) => {
      return { unit: item };
    })
  );

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
    const newData = Object.assign({}, chosenData);
    newData[filtersDataItem.id] = selectedData;
    setChosenData(newData);
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
      <ReactIScroll
        className="filters_menu__scroll_wrapper"
        iScroll={iScroll}
        options={{
          mouseWheel: true,
          scrollbars: true,
          interactiveScrollbars: true,
        }}
      >
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
      </ReactIScroll>
    </ul>
  );
};
export default FiltersCheckBoxScroll;
