import { createFactory } from "react";

export const PrepareData = (SATS, tableIDs) => {
  // приводим таблицу к виду с понятными критериями (GEO, MEO, LEO)
  const parseDataToCriteria = (tableID, value) => {
    // параметры перевода
    const matchCriteria = {
      UNApogee: {
        LEO: [160, 2000],
        MEO: [2001, 35000],
        GEO: [35001, 50000],
      },
    };
    // проходим в цикле по всем ключам, которые нужно обработать
    for (const possibleNewParameter of Object.keys(matchCriteria[tableID])) {
      if (value <= matchCriteria[tableID][possibleNewParameter])
        return possibleNewParameter;
    }
    return "пусто";
  };

  for (const [key, value] of Object.entries(SATS.default)) {
    for (const tableID of tableIDs) {
      // заменяем в исходной таблице и возвращаем её
      const newValue = parseDataToCriteria(tableID, value[tableID]);
      SATS[key][tableID] = newValue;
    }
  }

  return SATS;
};
