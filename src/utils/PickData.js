import * as SATS from "../utils/data.json";

export const PickData = (category, values, limit = 0) => {
  let categoryTypes = {};

  for (const [key, value] of Object.entries(SATS.default)) {
    const categoryType = value[category].split(" ")[0];
    if (!values || values.includes(categoryType)) {
      if (categoryType && Object.keys(categoryTypes).includes(categoryType))
        categoryTypes[categoryType] += 1;
      else categoryTypes[categoryType] = 1;
    }
  }

  let filteredCategoryTypes = {};
  for (const key in categoryTypes) {
    if (categoryTypes[key] >= limit) {
      filteredCategoryTypes[key] = categoryTypes[key];
    }
  }

  const categoryTypeKeys = Object.keys(filteredCategoryTypes);
  const categoryTypeValues = Object.values(filteredCategoryTypes);
  return [categoryTypeKeys, categoryTypeValues];
};
