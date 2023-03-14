export const PickData = (allData, currFilter, chosenData) => {
  // проходим по всей таблице и считаем повторяющиеся значения
  let countKeysObj = {};

  // ждём, пока прилетят данные из БД
  if (allData) {
    for (const lineTable of allData) {
      let currValue;
      // вызываем в функции collectChosenData() для чекбоксов побочной оси (нужно передавать их названия)
      if (Array.isArray(currFilter)) {
        // берём значение по ключу главной оси, только если для этого спутника совпадает значение по побочной оси
        currValue =
          Object.values(lineTable).includes(currFilter[1]) &&
          lineTable[currFilter[0]].split("-")[0];
        // запускаем если выбрали
        if (
          chosenData[currFilter[0]] &&
          chosenData[currFilter[0]].includes(currValue)
        ) {
          if (Object.keys(countKeysObj).includes(currValue))
            // если такое значение было, прибавляем
            countKeysObj[currValue] += 1;
          // иначе создаём новое поле
          else countKeysObj[currValue] = 1;
        }
      } else {
        currValue = lineTable[currFilter].split("-")[0];
        // вызываем в функции collectChosenData() для чекбоксов основной оси и в начале (чтобы скроллы с чекбоксами отрендерить)
        if (
          !chosenData ||
          (chosenData[currFilter] && chosenData[currFilter].includes(currValue))
        ) {
          if (currValue && Object.keys(countKeysObj).includes(currValue))
            // если такое значение было, прибавляем
            countKeysObj[currValue] += 1;
          // иначе создаём новое поле
          else countKeysObj[currValue] = 1;
        }
      }
    }
  }
  return countKeysObj;
};
