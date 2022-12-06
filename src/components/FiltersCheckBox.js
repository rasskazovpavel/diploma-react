import React, { useEffect, useState } from "react";
const FiltersCheckBox = (dataCategory) => {
  const [data, setData] = useState({
    name: dataCategory.name,
    options: dataCategory.options,
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
        {data &&
          data.options &&
          data.options.map((dataUnit, i) => {
            return (
              <li key={i}>
                <input
                  type="checkbox"
                  checked={dataUnit.isChecked}
                  value="child"
                  onChange={(e) => changeCheckboxStatus(e, dataUnit.unit)}
                />
                {dataUnit.unit}
              </li>
            );
          })}
      </ul>
    </ul>
  );
};
export default FiltersCheckBox;
