import "./style.css";

import { filtersData } from "../utils/FiltersData";
import FiltersCheckBoxScroll from "./Filters/FiltersCheckBoxScroll";
import FiltersAxes from "./Filters/FiltersAxes";
import FiltersTypeGraph from "./Filters/FiltersTypeGraph";

import "./FiltersMenu.scss";

const FiltersMenu = ({
  setChosenData,
  chosenData,
  axes,
  setAxes,
  setTypeGraph,
  typeGraph,
  setChartData,
}) => {
  const lineMain = filtersData.find((line) => line.id === axes.x);
  const lineSecondary = filtersData.find((line) => line.id === axes.y);
  return (
    <div className="filters_menu">
      <h3 className="filters_menu__title">Настройки</h3>
      <div className="filters_menu__settings">
        <FiltersTypeGraph
          setTypeGraph={setTypeGraph}
          setAxes={setAxes}
          setChosenData={setChosenData}
          setChartData={setChartData}
        />
        {typeGraph && (
          <FiltersAxes
            axes={axes}
            setAxes={setAxes}
            typeGraph={typeGraph}
            setChartData={setChartData}
            setChosenData={setChosenData}
          />
        )}
      </div>
      <div className="filters_menu__container">
        {lineMain && (
          <FiltersCheckBoxScroll
            filtersDataItem={lineMain}
            setChosenData={setChosenData}
            chosenData={chosenData}
            key={lineMain.id.main}
            order="main"
          />
        )}
        {lineSecondary && (
          <FiltersCheckBoxScroll
            filtersDataItem={lineSecondary}
            setChosenData={setChosenData}
            chosenData={chosenData}
            key={lineSecondary.id.main}
            order="secondary"
          />
        )}
      </div>
    </div>
  );
};
export default FiltersMenu;
