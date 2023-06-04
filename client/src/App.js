import { useState, useEffect } from "react";
import Analysis from "./Pages/Analysis/Analysis";
import Header from "./components/Header/Header";
import Review from "./Pages/Review/Review";
export default function App() {
  const [currPage, setCurrPage] = useState("0");
  return (
    <div className="App">
      <Header currPage={currPage} setCurrPage={setCurrPage} />
      <div className="content__wrapper">
        {currPage == 0 && <Review />}
        {currPage == 1 && <Analysis />}
      </div>
    </div>
  );
}
