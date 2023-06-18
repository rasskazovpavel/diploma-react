import React, { useEffect, useState } from "react";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
import { PickDataDB } from "../../utils/PickDataDB";
import "./Filters.scss";
import { sortObj } from "../../utils/utilsFunctions";
import { TableCodes } from "../../utils/TableCodes";
import { TooltipCodes } from "../../utils/TooltipCodes";

const FiltersCheckBoxScroll = ({
  filtersDataItem,
  setChosenData,
  chosenData,
  order,
}) => {
  // отбираем из таблицы данные по нужной категории
  const [listOpen, setListOpen] = useState(false);
  const [data, setData] = useState({});
  const [renderedData, setRenderedData] = useState({});
  const [inputQuery, setInputQuery] = useState();

  const openDropdown = (e) => {
    setListOpen(!listOpen);
  };

  const filterList = (value, currData) => {
    if (value) {
      let filteredData = currData.filter((line) => {
        if (line.isChecked) return true;
        return line.rusName.toLowerCase().includes(value.toLowerCase());
      });
      const newData = filteredData.sort((a, b) => {
        if (a.isChecked && !b.isChecked) return -1;
        if (!a.isChecked && b.isChecked) return 1;
        if ((a.isChecked && b.isChecked) || (!a.isChecked && !b.isChecked)) {
          return a.unit > b.unit ? 1 : -1;
        }
        return 0;
      });
      setRenderedData(newData);
    } else {
      const newData = currData.sort((a, b) => {
        if (a.isChecked && !b.isChecked) return -1;
        if (!a.isChecked && b.isChecked) return 1;
        if ((a.isChecked && b.isChecked) || (!a.isChecked && !b.isChecked)) {
          return a.unit > b.unit ? 1 : -1;
        }
        return 0;
      });
      setRenderedData(newData);
    }
  };

  const inputHandler = (e) => {
    const newInput = e.target.value;
    setInputQuery(newInput);
    filterList(newInput, data);
  };

  // обновляем выбранные данные
  const updateChosenData = (currData) => {
    const selectedData = currData.reduce((acc, line) => {
      if (line.isChecked) {
        acc.push(line.unit);
      }
      return acc;
    }, []);
    const newData = Object.assign({}, chosenData);
    const oldProp = [...selectedData];
    newData[order] = oldProp;
    setChosenData(newData);
  };

  // обновляем фильтры категории
  const changeCheckboxStatus = (e) => {
    const currData = data.map((line) =>
      line.unit === e.target.value
        ? {
            unit: line.unit,
            isChecked: !line.isChecked,
            value: line.value,
            rusName: line.rusName,
          }
        : line
    );
    const newData = [...currData];
    updateChosenData(newData);
    setData(newData);
    filterList(inputQuery, newData);
  };

  const clearCheckboxes = () => {
    const newData = [];
    data.forEach((line, order) => {
      newData.push({
        unit: line.unit,
        isChecked: false,
        value: line.value,
        rusName: line.rusName,
      });
    });
    updateChosenData(newData);
    setData(newData);
    setRenderedData(newData);
  };

  useEffect(() => {
    PickDataDB(filtersDataItem.id, "")
      .then((allData) => {
        const sortedData = sortObj(allData);
        const keys = Object.keys(sortedData);
        const newData = keys.map((key) => {
          const rusName =
            TableCodes[filtersDataItem.id] &&
            TableCodes[filtersDataItem.id][key]
              ? TooltipCodes[TableCodes[filtersDataItem.id][key]]
                ? TooltipCodes[TableCodes[filtersDataItem.id][key]]
                : TableCodes[filtersDataItem.id][key]
              : key;
          return { unit: key, value: allData[key], rusName: rusName };
        });
        return newData;
      })
      .then((totalData) => {
        setData(totalData);
        setRenderedData(totalData);
      });
  }, [filtersDataItem]);

  return (
    <div className="filters_checkbox_scroll">
      <ul>
        <div className="scroll_dropdown__wrappers">
          <div className="scroll_dropdown">
            <p
              className="scroll_dropdown_btn"
              onClick={openDropdown}
              id={filtersDataItem.id}
            >
              <span id={filtersDataItem.id}>{filtersDataItem.dropdown}</span>
              <span id={filtersDataItem.id}>
                {listOpen ? <>&#9650;</> : <>&#9660;</>}
              </span>
            </p>
            {listOpen && (
              <div className="filters_menu__scroll__elements">
                <input
                  type="text"
                  className="filters_menu__scroll_filter"
                  placeholder="Введите название"
                  onInput={(e) => inputHandler(e, order)}
                />
                {renderedData.length > 0 && (
                  <div className="filters_menu__scroll_inner">
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
                                className="filters_menu__checkbox"
                                value={line.unit}
                                onChange={(e) => changeCheckboxStatus(e, order)}
                                checked={line.isChecked}
                              />
                              {TableCodes[filtersDataItem.id] &&
                              TableCodes[filtersDataItem.id][line.unit]
                                ? TooltipCodes[
                                    TableCodes[filtersDataItem.id][line.unit]
                                  ]
                                  ? TooltipCodes[
                                      TableCodes[filtersDataItem.id][line.unit]
                                    ]
                                  : TableCodes[filtersDataItem.id][line.unit]
                                : line.unit}
                            </li>
                          );
                        })}
                      </ul>
                    </ReactIScroll>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ul>
      {listOpen && (
        <button className="filters_menu__clear" onClick={clearCheckboxes}>
          Очистить
        </button>
      )}
    </div>
  );
};
export default FiltersCheckBoxScroll;
