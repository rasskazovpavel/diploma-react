import { useState } from "react";
import Constructor from "./Pages/Constructor/Constructor";
import Header from "./components/Header/Header";
import HistoryData from "./Pages/HistoryData/HistoryData";
import CurrentSituation from "./Pages/CurrentSituation/CurrentSituation";
export default function App() {
  const [currPage, setCurrPage] = useState("0");
  return (
    <div className="App">
      <Header currPage={currPage} setCurrPage={setCurrPage} />
      <div className="content__wrapper">
        {currPage == 0 && <CurrentSituation />}
        {currPage == 1 && <HistoryData />}
        {currPage == 2 && <Constructor />}
      </div>
    </div>
  );
}
