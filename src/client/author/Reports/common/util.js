export const getVariance = arr => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += Number(arr[i]);
  }
  let mean = sum / arr.length;

  sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += Math.pow(arr[i] - mean, 2);
  }

  let variance = Number((sum / arr.length).toFixed(2));
  return variance;
};
export const getStandardDeviation = variance => {
  return Number(Math.sqrt(variance, 2).toFixed(2));
};

export const getHSLFromRange1 = val => {
  return `hsla(${val}, 100%, 79%, 1)`;
};

export const getHSLFromRange2 = val => {
  let tmp = val / 2;
  return `hsla(${tmp}, 100%, 48%, 1)`;
};

export const isMobileScreen = () => {
  return window.matchMedia("only screen and (max-width: 1033px) and (min-width : 1px)").matches;
};

export const getNavigationTabLinks = (list, id) => {
  for (let item of list) {
    item.location += id;
  }
};

export const getDropDownTestIds = arr => {
  let sortedArr = [...arr];

  let _arr = sortedArr.map((data, index) => {
    return { key: data.testId, title: data.testName };
  });

  return _arr;
};
