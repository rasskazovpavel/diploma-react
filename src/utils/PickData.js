export const PickData = (SATS, currFilter, chosenData, limit = 0) => {
  // проходим по всей таблице и считаем повторяющиеся значения
  let countKeysObj = {};

  for (const [key, lineTable] of Object.entries(SATS.default)) {
    const currValue = lineTable[currFilter].split(" ")[0];
    if (!chosenData || chosenData.includes(currValue)) {
      if (currValue && Object.keys(countKeysObj).includes(currValue))
        // если такое значение было, прибавляем
        countKeysObj[currValue] += 1;
      // иначе создаём новое поле
      else countKeysObj[currValue] = 1;
    }
  }

  let filteredCountKeysObj = {};
  for (const key in countKeysObj) {
    if (countKeysObj[key] >= limit) {
      filteredCountKeysObj[key] = countKeysObj[key];
    }
  }

  const categoryTypeKeys = Object.keys(filteredCountKeysObj);
  const categoryTypeValues = Object.values(filteredCountKeysObj);
  return [categoryTypeKeys, categoryTypeValues];
};
