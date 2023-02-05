import React, { useEffect, useState } from "react";
const FiltersCheckBox = (dataCategory) => {
  const [data, setData] = useState(dataCategory.options);
  const [parentChecked, setParentChecked] = useState(false);

  const changeCheckboxStatus = (i) => {
    setData(
      data.map((line, order) =>
        order === i
          ? { unit: data[i].unit, isChecked: !data[i].isChecked }
          : line
      )
    );
  };

  const changeParentCheckbox = (e) => {
    setParentChecked(e.currentTarget.checked);
    setData(
      data.map((line, order) => {
        return { unit: data[order].unit, isChecked: e.currentTarget.checked };
      })
    );
  };

  useEffect(() => {
    if (data.every((line) => line.isChecked === true)) {
      setParentChecked(true);
    } else setParentChecked(false);
  }, [data]);

  return (
    <ul>
      <li>
        <input
          type="checkbox"
          value="parent"
          onChange={(e) => changeParentCheckbox(e)}
          checked={parentChecked}
        />
        {dataCategory.name}
      </li>
      <ul>
        {data.map((line, i) => {
          return (
            <li>
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
