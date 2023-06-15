const randColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

const sortObj = (obj) => {
  const keys = Object.keys(obj);
  keys.sort();
  const sortedObj = {};
  const sortedObjLength = keys.length;
  for (let i = 0; i < sortedObjLength; i++) {
    let k = keys[i];
    sortedObj[k] = obj[k];
  }
  return sortedObj;
};

export { randColor, sortObj };
