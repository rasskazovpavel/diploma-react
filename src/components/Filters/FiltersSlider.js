import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll";
const FiltersSlider = (dataCategory) => {
  const [value, setValue] = useState([20, 37]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function valuetext(value) {
    return `${value}°C`;
  }
  return (
    <ul>
      <li>
        <input type="checkbox" />
        {dataCategory.name}
        <ul>
          <li>
            <Slider
              aria-label="Always visible"
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={180}
            />
          </li>
        </ul>
      </li>
    </ul>
  );
};
export default FiltersSlider;
