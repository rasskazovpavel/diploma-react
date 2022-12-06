import React, { useEffect, useState } from "react";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
import { PickData } from "../utils/PickData";

const FiltersCheckBoxScroll = (dataCategory) => {
  const [keys, values] = PickData(dataCategory.id, 20);
  console.log(keys);
  const [data, setData] = useState({
    name: dataCategory.name,
    options: keys,
  });
  const [isParentChecked, setIsParentChecked] = useState(false);
  // useEffect(() => console.log(data));
  const changeCheckboxStatus = (e, id) => {
    const myData = [data.name, ...data.options];
    const { checked } = e.target;
    myData.map((dataUnit) => {
      if (id === data.name) {
        setIsParentChecked(checked);
        myData.isChecked = checked;
        for (const option in myData) {
          if (typeof myData[option] === "object")
            myData[option].isChecked = checked;
        }
      } else {
        data.options.forEach((optionsElement) => {
          if (optionsElement.unit === id) {
            optionsElement.isChecked = checked;
          }
        });
        const isAllChildsChecked = data.options.every(
          (dataUnit) => dataUnit.isChecked === true
        );
        if (isAllChildsChecked) {
          setIsParentChecked(checked);
          myData.isChecked = true;
        } else {
          setIsParentChecked(false);
          myData.isChecked = false;
        }
      }
      return dataUnit;
    });
    const [nameUnit, ...optionsUnit] = myData;
    setData({
      name: nameUnit,
      options: optionsUnit,
      isChecked: myData.isChecked,
    });
  };

  return (
    <ul>
      <li>
        <input
          type="checkbox"
          value="parent"
          onChange={(e) => changeCheckboxStatus(e, data.name)}
          checked={isParentChecked}
        />
        {data.name}
      </li>
      <ul>
        <ReactIScroll
          className="filters_menu__scroll_wrapper"
          iScroll={iScroll}
          options={{
            mouseWheel: true,
            scrollbars: true,
            interactiveScrollbars: true,
          }}
        >
          {data &&
            data.options &&
            data.options.map((dataUnit, i) => {
              return (
                <ul>
                  {keys.map((key) => {
                    return (
                      <li>
                        <input type="checkbox" />
                        {key}
                      </li>
                    );
                  })}
                </ul>
              );
            })}
        </ReactIScroll>
      </ul>
    </ul>
  );
};
export default FiltersCheckBoxScroll;
