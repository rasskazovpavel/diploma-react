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
  const [listOpen, setListOpen] = useState({});
  const [data, setData] = useState({});
  const [renderedData, setRenderedData] = useState({});
  const [inputQuery, setInputQuery] = useState({});

  // const [data, setData] = useState(
  //   Object.keys(PickData(allData, filtersDataItem.id)).map((item) => {
  //     return { unit: item };
  //   })
  // );

  // const [parentChecked, setParentChecked] = useState(false);

  const chooseCategory = (e) => {
    let newChosenGraphs = [...chosenGraphs];
    if (chosenGraphs.includes(filtersDataItem.name)) {
      const index = chosenGraphs.indexOf(filtersDataItem.name);
      if (index !== -1) {
        console.log(data);
        newChosenGraphs.splice(index, 1);
        const newData = {};
        Object.entries(data).forEach(([key, val]) => {
          newData[key] = val.map((el) => {
            return { unit: el.unit, isChecked: false, value: el.value };
          });
        });
        console.log(newData);
        // const currData = data.map((line) => {
        //   return { unit: line.unit, isChecked: false, value: line.value };
        // });
        // const newData = [...currData];
        filterList(inputQuery, newData, null);
        setData(newData);
        const newChosenData = Object.assign({}, chosenData);
        console.log(chosenData);
        Object.keys(chosenData).forEach((key) => {
          newChosenData[key] = [];
        });
        setChosenData(newChosenData);
        const newListOpen = Object.assign({}, listOpen);
        console.log(newListOpen);
        Object.keys(newListOpen).forEach((key) => (newListOpen[key] = false));
        setListOpen(newListOpen);
      }
    } else {
      newChosenGraphs.push(filtersDataItem.name);
    }
    console.log(newChosenGraphs, graphId);
    setChosenGraphs(newChosenGraphs);
    setCurrFilter([filtersDataItem.name]);
  };

  const openDropdown = (e) => {
    if (chosenGraphs.includes(filtersDataItem.name)) {
      const newListOpen = Object.assign({}, listOpen);
      newListOpen[e.target.innerHTML] = !newListOpen[e.target.innerHTML];
      console.log(newListOpen, e.target.innerHTML);
      setListOpen(newListOpen);
    }
  };

  const filterList = (value, currData, axes) => {
    console.log("тут");
    // if (axes === null)
    if (value && axes !== null) {
      let filteredData = currData[axes].filter((line) => {
        console.log(line.unit);
        return line.unit.toLowerCase().includes(value.toLowerCase());
      });
      const newData = Object.assign({}, currData);
      newData[axes] = filteredData;
      console.log(newData);
      setRenderedData(newData);
      console.log(newData);
    } else {
      setRenderedData(currData);
    }
  };

  const inputHandler = (e, axes) => {
    const newInput = Object.assign({}, inputQuery);
    newInput[axes] = e.target.value;
    setInputQuery(newInput);
    filterList(e.target.value, data, axes);
  };

  // обновляем выбранные данные
  const updateChosenData = (currData, axes) => {
    // обновляем текущий фильтр в App.js
    // если все фильтры категории выбраны, то родительский тоже
    // if (currData.every((line) => line.isChecked === true)) {
    //   setParentChecked(true);
    // } else setParentChecked(false);
    // собираем в массивы выбранные фильтры

    const selectedData = currData[axes].reduce((acc, line) => {
      if (line.isChecked) {
        acc.push(line.unit);
      }
      return acc;
    }, []);
    // const newData = { ...chosenData, [filtersDataItem.id]: selectedData };
    console.log(chosenData, filtersDataItem);
    const newData = Object.assign({}, chosenData);
    const oldProp = newData[filtersDataItem.name] || {};
    oldProp[axes] = [...selectedData];
    newData[filtersDataItem.name] = oldProp;
    // const newData = {
    //   ...chosenData,
    //   [filtersDataItem.name]: {
    //     ...chosenData[filtersDataItem.id],
    //     [axes]: [...selectedData],
    //   },
    // };
    console.log(currData);
    // newData[filtersDataItem.id] = selectedData;
    setChosenData(newData);
    setCurrFilter([filtersDataItem.name, axes]);
  };

  // обновляем фильтры категории
  const changeCheckboxStatus = (e, axes) => {
    console.log(axes);
    const currData = data[axes].map((line) =>
      line.unit === e.target.value
        ? {
            unit: line.unit,
            isChecked: !line.isChecked,
            value: line.value,
          }
        : line
    );
    const newData = Object.assign({}, data);
    newData[axes] = currData;
    console.log(newData);
    updateChosenData(newData, axes);
    // filterList(inputQuery);
    setData(newData);
    filterList(inputQuery[axes], newData, axes);
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
    // const totalData = {};
    // const singleAxis = chosenData[axes[currFilter].x].map((elem) => {
    //   return PickDataDB(axes[currFilter].x, elem).then((allData) => {
    //     return allData;
    //   });
    // });
    const totalData = Object.values(filtersDataItem.id).map((id) => {
      console.log(id);
      return PickDataDB(id, "").then((allData) => {
        const keys = Object.keys(allData);
        const newData = keys.map((key) => {
          return { unit: key, value: allData[key] };
        });
        return newData;
      });
    });
    Promise.all(totalData).then((totalData) => {
      console.log(totalData);
      const finalData = {};
      totalData.forEach((arr, i) => {
        console.log(filtersDataItem.id);
        finalData[Object.keys(filtersDataItem.id)[i]] = totalData[i];
      });
      console.log(finalData);
      setData(finalData);
      setRenderedData(finalData);
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
        {chosenGraphs.includes(filtersDataItem.name) &&
          Object.entries(filtersDataItem.dropdown).map((entry, i) => {
            return (
              <div key={i}>
                <p className="scroll_dropdown" onClick={openDropdown}>
                  {entry[1]}
                </p>
                {listOpen[entry[1]] && (
                  <>
                    <input
                      type="text"
                      className="filters_menu__scroll_filter"
                      placeholder="Введите название"
                      onInput={(e) => inputHandler(e, entry[0])}
                    />
                    {/* <InputText inputHandler={inputHandler} /> */}
                    {renderedData[entry[0]].length > 0 && (
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
                          {renderedData[entry[0]].map((line, i) => {
                            return (
                              <li key={line.unit}>
                                <input
                                  type="checkbox"
                                  value={line.unit}
                                  onChange={(e) =>
                                    changeCheckboxStatus(e, entry[0])
                                  }
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
              </div>
            );
          })}
      </ul>
      {/* <button onClick={clearCheckboxes}>Очистить</button> */}
    </>
  );
};
export default FiltersCheckBoxScroll;
