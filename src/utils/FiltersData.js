export const filtersData = [
  // {
  //   name: "Высоты",
  //   options: [{ unit: "GEO" }, { unit: "MEO" }, { unit: "LEO" }],
  //   type: "checkbox",
  //   id: "UNApogee",
  // },
  {
    name: "Количество спутников по именам",
    options: [],
    type: "checkbox-scroll",
    id: { main: "name_sat" },
    chart: "barchart",
    dropdown: { main: "Выбор имени" },
  },
  {
    name: "Некоторые статусы спутников по странам",
    options: [],
    type: "checkbox-scroll",
    id: { main: "country_op", secondary: "date_launch" },
    chart: "barchart",
    dropdown: { main: "Выбор страны", secondary: "Выбор года" },
  },
  // {
  //   name: "Распределение статусов спутников по странам",
  //   options: [],
  //   type: "checkbox-scroll",
  //   id: "country_op",
  // },
  // {
  //   name: "Площадки запуска",
  //   options: [],
  //   type: "checkbox-scroll",
  //   id: "Program",
  // },
  // {
  //   name: "RCS",
  //   options: [{ unit: "Малая" }, { unit: "Средняя" }, { unit: "Большая" }],
  //   type: "checkbox",
  // },
  // {
  //   name: "Износ",
  //   options: [
  //     { unit: "1 группа" },
  //     { unit: "2 группа" },
  //     { unit: "3 группа" },
  //     { unit: "4 группа" },
  //   ],
  //   type: "checkbox",
  // },
  // { name: "Склонения", options: [], type: "slider" },
];
