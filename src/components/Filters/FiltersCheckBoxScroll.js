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
  graphId,
  chartData,
  setChartData,
  chosenGraphs,
  setChosenGraphs,
}) => {
  // отбираем из таблицы данные по нужной категории
  const [listOpen, setListOpen] = useState(false);
  const [data, setData] = useState();
  const [renderedData, setRenderedData] = useState([]);
  const [inputQuery, setInputQuery] = useState("");

  // const [data, setData] = useState(
  //   Object.keys(PickData(allData, filtersDataItem.id)).map((item) => {
  //     return { unit: item };
  //   })
  // );

  // const [parentChecked, setParentChecked] = useState(false);

  const chooseCategory = (e) => {
    let newChosenGraphs = [...chosenGraphs];
    if (chosenGraphs.includes(graphId)) {
      const index = chosenGraphs.indexOf(graphId);
      if (index !== -1) {
        console.log(index, chosenGraphs, newChosenGraphs);
        newChosenGraphs.splice(index, 1);
        const currData = data.map((line) => {
          return { unit: line.unit, isChecked: false, value: line.value };
        });
        const newData = [...currData];
        filterList(inputQuery, newData);
        setData(newData);
        const newChosenData = Object.assign({}, chosenData);
        newChosenData[graphId] = [];
        setChosenData(newChosenData);
        setListOpen(false);
      }
    } else {
      newChosenGraphs.push(graphId);
    }
    console.log(newChosenGraphs, graphId);
    setChosenGraphs(newChosenGraphs);
    setCurrFilter(filtersDataItem.id);
  };

  const openDropdown = () => {
    if (chosenGraphs.includes(graphId)) {
      setListOpen(!listOpen);
    }
  };

  const filterList = (value, currData) => {
    if (value !== "") {
      let filteredData = currData.filter((line) => {
        return line.unit.toLowerCase().includes(value.toLowerCase());
      });
      const newData = [...filteredData];
      setRenderedData(newData);
      console.log(newData);
    } else {
      setRenderedData(currData);
    }
  };

  const inputHandler = (e) => {
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
    const newData = { ...chosenData, [filtersDataItem.id]: selectedData };
    // newData[filtersDataItem.id] = selectedData;
    setChosenData(newData);
    setCurrFilter(filtersDataItem.id);
  };

  // обновляем фильтры категории
  const changeCheckboxStatus = (e) => {
    const currData = data.map((line) =>
      line.unit === e.target.value
        ? {
            unit: line.unit,
            isChecked: !line.isChecked,
            value: line.value,
          }
        : line
    );
    updateChosenData(currData);
    // filterList(inputQuery);
    const newData = [...currData];
    setData(newData);
    filterList(inputQuery, newData);
  };

  // обновляем родительский чекбокс
  // const changeParentCheckbox = (e) => {
  //   setParentChecked(e.currentTarget.checked);
  //   const currData = data.map((line, order) => {
  //     return { unit: data[order].unit, isChecked: e.currentTarget.checked };
  //   });
  //   updateChosenData(currData);
  //   setData(currData);
  // };

  // const clearCheckboxes = () => {
  //   setParentChecked(false);
  //   const currData = data.map((line, order) => {
  //     return { unit: data[order].unit, isChecked: false };
  //   });
  //   updateChosenData(currData);
  //   setData(currData);
  // };

  useEffect(() => {
    PickDataDB(filtersDataItem.id, "")
      .then((allData) => {
        const keys = Object.keys(allData);
        const newData = keys.map((key) => {
          return { unit: key, value: allData[key] };
        });
        return newData;
      })
      .then((allData) => {
        setData(allData);
        setRenderedData(allData);
      });
  }, [filtersDataItem.id]);

  console.log(chosenGraphs.includes(graphId));
  return (
    <>
      <ul>
        <li>
          <input
            type="checkbox"
            value={currFilter}
            onChange={(e) => chooseCategory(e)}
          />
          {filtersDataItem.name}
        </li>
        {chosenGraphs.includes(graphId) && (
          <p className="scroll_dropdown" onClick={openDropdown}>
            Выбор имени
          </p>
        )}
        {listOpen && chosenGraphs.includes(graphId) && (
          <>
            <input
              type="text"
              className="filters_menu__scroll_filter"
              placeholder="Введите название"
              onInput={inputHandler}
            />
            {/* <InputText inputHandler={inputHandler} /> */}
            {renderedData.length > 0 && (
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
                  {renderedData.map((line, i) => {
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
            )}
          </>
        )}
      </ul>
      {/* <button onClick={clearCheckboxes}>Очистить</button> */}
    </>
  );
};
export default FiltersCheckBoxScroll;
