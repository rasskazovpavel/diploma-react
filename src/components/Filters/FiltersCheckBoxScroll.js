import React, { memo, useEffect, useRef, useState } from "react";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
import { PickData } from "../../utils/PickData";
import { PickDataDB } from "../../utils/PickDataDB";

const FiltersCheckBoxScroll = ({
  filtersDataItem,
  setChosenData,
  setCurrFilter,
  chosenData,
  currFilter,
  allData,
}) => {
  // отбираем из таблицы данные по нужной категории
  console.log(chosenData);
  console.log(filtersDataItem.id);
  const [data, setData] = useState();
  const [renderedData, setRenderedData] = useState();
  const [inputQuery, setInputQuery] = useState("");
  const inputRef = useRef();
  // const [data, setData] = useState(
  //   Object.keys(PickData(allData, filtersDataItem.id)).map((item) => {
  //     return { unit: item };
  //   })
  // );

  const [parentChecked, setParentChecked] = useState(false);

  const filterList = (value, currData) => {
    console.log(value);
    if (value) {
      let filteredData = currData.filter((line) => {
        console.log(line.unit, value);
        return line.unit.toLowerCase().includes(value.toLowerCase());
      });
      const newData = [...filteredData];
      console.log(newData);
      setRenderedData(newData);
    } else setRenderedData(data);
  };

  const inputHandler = (e) => {
    console.log(e.target.value);
    setInputQuery(e.target.value);
    filterList(e.target.value, data);
  };

  // обновляем выбранные данные
  const updateChosenData = (currData) => {
    // обновляем текущий фильтр в App.js
    // если все фильтры категории выбраны, то родительский тоже
    // if (currData.every((line) => line.isChecked === true)) {
    //   setParentChecked(true);
    // } else setParentChecked(false);
    // собираем в массивы выбранные фильтры
    const selectedData = currData.reduce((acc, line) => {
      if (line.isChecked) {
        acc.push(line.unit);
      }
      return acc;
    }, []);
    console.log(currData);
    const newData = { ...chosenData, [filtersDataItem.id]: selectedData };
    // newData[filtersDataItem.id] = selectedData;
    setChosenData(newData);
    setCurrFilter(filtersDataItem.id);
  };

  // обновляем фильтры категории
  const changeCheckboxStatus = (e) => {
    console.log(e.target);
    const currData = data.map((line) =>
      line.unit === e.target.value
        ? {
            unit: line.unit,
            isChecked: e.target.checked,
            value: line.value,
          }
        : line
    );
    console.log("currData", currData);
    updateChosenData(currData);
    // filterList(inputQuery);
    setData(currData);
    filterList(inputQuery, currData);
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

  const clearCheckboxes = () => {
    setParentChecked(false);
    const currData = data.map((line, order) => {
      return { unit: data[order].unit, isChecked: false };
    });
    updateChosenData(currData);
    setData(currData);
  };

  useEffect(() => {
    PickDataDB(filtersDataItem.id, "")
      .then((allData) => {
        const keys = Object.keys(allData);
        const newData = keys.map((key) => {
          return { unit: key, value: allData[key] };
        });
        console.log(newData);
        return newData;
      })
      .then((allData) => {
        setData(allData);
        setRenderedData(allData);
      });
  }, []);

  return (
    <>
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
        <input
          type="text"
          className="filters_menu__scroll_filter"
          placeholder="Введите название"
          onInput={inputHandler}
          ref={inputRef}
        />
        {/* <InputText inputHandler={inputHandler} /> */}
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
            {renderedData &&
              renderedData.map((line, i) => {
                return (
                  <li key={line.unit}>
                    <input
                      type="checkbox"
                      value={line.unit}
                      onChange={(e) => changeCheckboxStatus(e)}
                      checked={line.isChecked}
                    />
                    {line.unit}
                  </li>
                );
              })}
          </ul>
        </ReactIScroll>
      </ul>
      {/* <button onClick={clearCheckboxes}>Очистить</button> */}
    </>
  );
};
export default FiltersCheckBoxScroll;
