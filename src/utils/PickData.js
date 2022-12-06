import * as SATS from "../utils/data.json";

export const PickData = (category, limit) => {
  let categoryTypes = {};

  for (const [key, value] of Object.entries(SATS.default)) {
    const categoryType = value[category].split(" ")[0];
    if (categoryType && Object.keys(categoryTypes).includes(categoryType))
      categoryTypes[categoryType] += 1;
    else categoryTypes[categoryType] = 1;
  }

  let filteredCategoryTypes = {};
  for (const key in categoryTypes) {
    // console.log(key, categoryTypes[key] >= 10);
    if (categoryTypes[key] >= limit) {
      filteredCategoryTypes[key] = categoryTypes[key];
      console.log(filteredCategoryTypes);
    }
  }

  const categoryTypeKeys = Object.keys(filteredCategoryTypes);
  return [categoryTypeKeys, filteredCategoryTypes];
};
