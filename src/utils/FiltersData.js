export const filtersData = [
  {
    name: "Высоты",
    options: [{ unit: "GEO" }, { unit: "MEO" }, { unit: "LEO" }],
    type: "checkbox",
  },
  {
    name: "Назначения",
    options: [{ unit: "Разведка" }, { unit: "Связь" }, { unit: "Прочее" }],
    type: "checkbox",
  },
  { name: "Страны", options: [], type: "checkbox-scroll", id: "UNState" },
  {
    name: "Площадки запуска",
    options: [],
    type: "checkbox-scroll",
    id: "Program",
  },
  {
    name: "RCS",
    options: [{ unit: "Малая" }, { unit: "Средняя" }, { unit: "Большая" }],
    type: "checkbox",
  },
  {
    name: "Износ",
    options: [
      { unit: "1 группа" },
      { unit: "2 группа" },
      { unit: "3 группа" },
      { unit: "4 группа" },
    ],
    type: "checkbox",
  },
  { name: "Склонения", options: [], type: "slider" },
];
