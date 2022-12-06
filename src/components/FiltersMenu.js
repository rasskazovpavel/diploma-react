import "./style.css";
import { useState } from "react";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBox from "./FiltersCheckBox";
import FiltersCheckBoxScroll from "./FiltersCheckBoxScroll";
import FiltersSlider from "./FiltersSlider";
// console.log(SATS);

// console.log(UNStateKeys);

function FiltersMenu() {
  return (
    <div className="filters_menu">
      {filtersData.map((line, i) => {
        if (line.type === "checkbox") return FiltersCheckBox(line);
        if (line.type === "checkbox-scroll") return FiltersCheckBoxScroll(line);
        if (line.type === "slider") return FiltersSlider(line);
      })}

      {/* <ul>
          <input type="checkbox" />
          Высоты
          <ul>
            <li>
              <input type="checkbox" />
              GEO
            </li>
            <li>
              <input type="checkbox" />
              MEO
            </li>
            <li>
              <input type="checkbox" />
              LEO
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li>
          <input type="checkbox" />
          Склонения
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
      <ul>
        <li>
          <input type="checkbox" />
          Назначения
          <ul>
            <li>
              <input type="checkbox" />
              Разведка
            </li>
            <li>
              <input type="checkbox" />
              Связь
            </li>
            <li>
              <input type="checkbox" />
              Прочее
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li>
          <input type="checkbox" />
          Страны
          <ReactIScroll
            className="countries__scroll"
            iScroll={iScroll}
            options={{
              mouseWheel: true,
              scrollbars: true,
              interactiveScrollbars: true,
            }}
          >
            <ul>
              {UNStateKeys.map((key) => {
                return (
                  <li>
                    <input type="checkbox" />
                    {key}
                  </li>
                );
              })}
            </ul>
          </ReactIScroll>
        </li>
      </ul>
      <ul>
        <li>
          <input type="checkbox" />
          Площадки запуска
          <ul></ul>
        </li>
      </ul>
      <ul>
        <li>
          <input type="checkbox" />
          RCS
          <ul>
            <li>
              <input type="checkbox" />
              Малая
            </li>
            <li>
              <input type="checkbox" />
              Средняя
            </li>
            <li>
              <input type="checkbox" />
              Большая
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li>
          <input type="checkbox" />
          Износ
          <ul>
            <li>
              <input type="checkbox" />1 группа
            </li>
            <li>
              <input type="checkbox" />2 группа
            </li>
            <li>
              <input type="checkbox" />3 группа
            </li>
            <li>
              <input type="checkbox" />4 группа
            </li>
          </ul>
        </li>
      </ul> */}
      <p>
        <button id="btn" className="btn btn-sm btn-outline-primary">
          Применить
        </button>
      </p>
    </div>
  );
}
export default FiltersMenu;
